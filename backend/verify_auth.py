import requests
import json

BASE_URL = "http://localhost:8000"

def test_auth_flow():
    print("1. Intentando login inicial (Reynaldo)...")
    login_data = {"email": "reynaldo@unisalamanca.edu.co", "password": "Unisalamanca2024*"}
    resp = requests.post(f"{BASE_URL}/login", json=login_data)
    
    if resp.status_code != 200:
        print(f"FAILED: Login falló con {resp.status_code} - {resp.text}")
        return
    
    data = resp.json()
    user_id = data['user']['id']
    token = data['access_token']
    must_change = data['user']['must_change_password']
    print(f"SUCCESS: Login exitoso. UserID: {user_id}, MustChange: {must_change}")
    
    if must_change:
        print("\n2. Intentando cambio de contraseña obligatorio...")
        change_data = {
            "user_id": user_id,
            "current_password": "Unisalamanca2024*",
            "new_password": "ReynaldoNew2024*"
        }
        resp_change = requests.post(f"{BASE_URL}/change-password", json=change_data)
        if resp_change.status_code == 200:
            print("SUCCESS: Contraseña actualizada.")
        else:
            print(f"FAILED: Cambio password falló - {resp_change.text}")
            return

        print("\n3. Verificando nuevo login...")
        login_data_new = {"email": "reynaldo@unisalamanca.edu.co", "password": "ReynaldoNew2024*"}
        resp_new = requests.post(f"{BASE_URL}/login", json=login_data_new)
        if resp_new.status_code == 200 and not resp_new.json()['user']['must_change_password']:
            print("SUCCESS: Login con nueva contraseña exitoso y ya no pide cambio.")
        else:
            print(f"FAILED: Login post-cambio falló - {resp_new.text}")

if __name__ == "__main__":
    test_auth_flow()
