import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncStudents() {
  const rawData = fs.readFileSync('students_data.json', 'utf8');
  const students = JSON.parse(rawData);

  console.log(`Starting sync for ${students.length} students...`);

  for (const student of students) {
    try {
      // 1. Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('user')
        .select('id')
        .eq('code', student.code)
        .single();

      let userId;

      if (fetchError && fetchError.code === 'PGRST116') {
        // User not found, create it
        console.log(`Creating user: ${student.name} (${student.code})`);
        const email = `est_${student.code}@unisalamanca.edu.co`;
        const { data: newUser, error: insertError } = await supabase
          .from('user')
          .insert([
            {
              name: student.name,
              email: email,
              role: 'ESTUDIANTE',
              code: student.code,
              status: 'Active'
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error(`Error creating user ${student.code}:`, insertError.message);
          continue;
        }
        userId = newUser.id;
      } else if (fetchError) {
        console.error(`Error fetching user ${student.code}:`, fetchError.message);
        continue;
      } else {
        userId = existingUser.id;
        // console.log(`User already exists: ${student.name} (${student.code})`);
      }

      // 2. Sync characterization
      const { data: existingChar, error: charError } = await supabase
        .from('characterization')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (charError && charError.code === 'PGRST116') {
        // Characterization missing, create it
        const { error: charInsertError } = await supabase
          .from('characterization')
          .insert([
            {
              user_id: userId,
              gender: student.gender,
              marital_status: student.marital_status,
              // Add other fields if necessary
            }
          ]);

        if (charInsertError) {
          console.error(`Error creating characterization for ${student.code}:`, charInsertError.message);
        } else {
          console.log(`Characterization created for: ${student.name}`);
        }
      } else if (charError) {
        console.error(`Error fetching characterization for ${student.code}:`, charError.message);
      } else {
        // Update characterization
        const { error: charUpdateError } = await supabase
          .from('characterization')
          .update({
            gender: student.gender,
            marital_status: student.marital_status
          })
          .eq('user_id', userId);

        if (charUpdateError) {
          console.error(`Error updating characterization for ${student.code}:`, charUpdateError.message);
        }
      }
    } catch (err) {
      console.error(`Unexpected error for ${student.code}:`, err.message);
    }
  }

  console.log('Sync completed.');
}

syncStudents();
