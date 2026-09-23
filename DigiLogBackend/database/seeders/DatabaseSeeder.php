<?php

namespace Database\Seeders;

use App\Models\Equipment;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Dell Latitude 3420', 'category' => 'Laptop', 'serial_number' => 'LAP-001'],
            ['name' => 'Lenovo ThinkPad E14', 'category' => 'Laptop', 'serial_number' => 'LAP-002'],
            ['name' => 'Epson EB-X06 Projector', 'category' => 'Projector', 'serial_number' => 'PRJ-001'],
            ['name' => 'ViewSonic PA503S', 'category' => 'Projector', 'serial_number' => 'PRJ-002'],
            ['name' => 'HDMI to USB-C Adapter', 'category' => 'HDMI Adapter', 'serial_number' => 'ADP-001'],
            ['name' => 'HDMI to VGA Adapter', 'category' => 'HDMI Adapter', 'serial_number' => 'ADP-002'],
            ['name' => 'Heavy Duty 5M Extension Cord', 'category' => 'Extension Cord', 'serial_number' => 'EXT-001'],
            ['name' => 'Omni 3-Gang 3M Extension Cord', 'category' => 'Extension Cord', 'serial_number' => 'EXT-002'],
        ];

        foreach ($items as $item) {
            Equipment::create($item);
        }
    }
}