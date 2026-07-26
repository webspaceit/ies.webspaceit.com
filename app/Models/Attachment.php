<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attachment extends Model
{
    protected $fillable = [
        'transaction_id',
        'filename',
        'path',
        'mime_type',
        'size',
        'description',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
