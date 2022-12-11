<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="user-json" content="{{ \Auth::user() }}">
        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="stylesheet" href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap">

        <link rel="stylesheet" href="{{ asset('fullcalendar.js/main.min.css') }}">
        <script src="https://kit.fontawesome.com/3fb98af6e8.js" crossorigin="anonymous"></script>

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">

            <div class="flex">
                <aside class="w-16 bg-gradient-to-br from-slate-600 to-slate-800 flex flex-col items-center text-slate-300" style="height: 100vh;">
                    <x-sidebar-link
                        title="Dashboard"
                        route="dashboard"
                        icon="fa-solid fa-house"></x-sidebar-link>

                    @foreach(\App\Models\Module::all() as $module)
                    <x-sidebar-link
                        color="{{ $module->color }}"
                        title="{{ $module->title }}"
                        route="{{ $module->route_name }}"
                        icon="{{ $module->icon }}"></x-sidebar-link>
                    @endforeach
                </aside>
                <main class="w-full p-4">
                    {{ $slot }}
                </main>

            </div>
        </div>

        <div class="hidden bg-gradient-to-br from-blue-500 to-blue-700 text-red-600 text-red-500 bg-red-500 from-red-500 hover:text-red-500 text-blue-500 bg-blue-500 from-blue-500 hover:text-blue-500 text-orange-500 bg-orange-500 from-orange-500 hover:text-orange-500 text-emerald-500 bg-emerald-500 from-emerald-500 hover:text-emerald-500 text-yellow-500 bg-yellow-500 from-yellow-500 hover:text-yellow-500"></div>

        @include('layouts.corejs')
        @isset($scripts)
            {{ $scripts }}
        @endif
    </body>
</html>
