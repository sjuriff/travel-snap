// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
      
        'background' : '#191c19',
        'bakcgroundVariant' : '#151515',
        'outline': "#8b938a",
        'primary' : "#81d997",
        'secondary' : "#ffb1c2",
        'tertiary' : '#d6baff',
        'error' : "#93000a",
        'disabled' : '#c1c9bf',
        'primaryContainer' : '#9df6b1',
        'secondaryContainer' : '#ffd9e0',
        'tertiaryContainer' : '#ecdcff',
        'onPrimary' : '#003919',
        'onSecondary' : '#5f112d',
        'onTertary' : '#3e1c6f',
        'onPrimaryContainer' : '#9df6b1',
        'onSecondaryContainer' : '#ffd9e0',
        'onTertiaryContainer' : "#ecdcff",
        'onError' : '#ffdad6',
        'onBackground' : '#e2e3de'

      
      }
    },
  },
  plugins: [],
}

