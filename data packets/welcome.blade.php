@extends('index')

@section('title', 'Hoş Geldiniz')

@section('content')
<div class="container">
    <div class="welcome-section">
        <h1>{{ config('app.name', 'Laravel') }}'e Hoş Geldiniz</h1>
        
        @if (session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif

        <div class="featured-content">
            <div class="card">
                <h2>Özellikler</h2>
                <ul>
                    <li>Responsive Tasarım</li>
                    <li>Modern Arayüz</li>
                    <li>Güvenli Altyapı</li>
                    <li>Hızlı Performans</li>
                </ul>
            </div>

            @auth
                <div class="user-dashboard">
                    <h2>Hoş geldin, {{ Auth::user()->name }}</h2>
                    <div class="quick-actions">
                        <a href="{{ route('dashboard') }}" class="btn">Panele Git</a>
                        <a href="{{ route('profile.edit') }}" class="btn">Profili Düzenle</a>
                    </div>
                </div>
            @else
                <div class="auth-buttons">
                    <a href="{{ route('login') }}" class="btn">Giriş Yap</a>
                    <a href="{{ route('register') }}" class="btn">Kayıt Ol</a>
                </div>
            @endauth
        </div>
    </div>
</div>
@endsection

@section('footer')
<div class="footer-content">
    <p>&copy; {{ date('Y') }} {{ config('app.name', 'Laravel') }}. Tüm hakları saklıdır.</p>
</div>
@endsection
