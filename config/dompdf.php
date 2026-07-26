<?php

return [
    'font_dir' => storage_path('fonts'),
    'font_cache' => storage_path('fonts'),
    'temp_dir' => storage_path('fonts'),
    
    'default_font' => 'figtree',
    
    'font_height_ratio' => 1.1,
    
    'enable_font_subsetting' => false,
    
    'pdf_backend' => 'CPDF',
    
    'enable_remote' => true,
    
    'font_names' => [
        'figtree' => 'Figtree-Regular',
        'figtree_bold' => 'Figtree-Bold',
    ],
];