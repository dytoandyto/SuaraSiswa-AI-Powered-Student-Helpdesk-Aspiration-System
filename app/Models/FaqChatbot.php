<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaqChatbot extends Model
{
    protected $table = 'faq_chatbots'; 
    protected $fillable = [
        'keyword',
        'pertanyaan',
        'jawaban',
        'kategori',
    ];
}