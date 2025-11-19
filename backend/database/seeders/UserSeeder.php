<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users matching the original mock data
        $users = [
            [
                'username' => 'student_01',
                'name' => 'Alice Dev',
                'email' => 'alice@example.com',
                'password' => Hash::make('learn2code'),
            ],
            [
                'username' => 'student_02',
                'name' => 'Bob Scripter',
                'email' => 'bob@example.com',
                'password' => Hash::make('react_rocks'),
            ],
            [
                'username' => 'demo',
                'name' => 'Demo User',
                'email' => 'demo@example.com',
                'password' => Hash::make('123456'),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['username' => $userData['username']],
                $userData
            );
        }
    }
}
