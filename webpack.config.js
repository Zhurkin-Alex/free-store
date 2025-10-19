// базовые импорты для путей и плагинов
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';       // создаёт index.html и подключает туда JS/CSS
import MiniCssExtractPlugin from 'mini-css-extract-plugin'; // выносит CSS в отдельные файлы при сборке

const __dirname = process.cwd(); // текущая рабочая директория проекта

export default (env, argv) => {
  const isProd = argv.mode === 'production'; // флаг: режим сборки (dev/prod)

  return {
    entry: './src/main.tsx', // точка входа (основной JS-файл)
    output: {
      path: path.resolve(__dirname, 'dist'), // куда складывать сборку
      filename: isProd
        ? 'assets/js/[name].[contenthash:8].js' // имя файлов с хэшем (для prod)
        : 'assets/js/[name].js',                // имя файлов без хэша (для dev)
      assetModuleFilename: 'assets/[hash][ext][query]', // шаблон для ассетов (картинки, шрифты)
      clean: true, // очищать папку dist перед сборкой
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // расширения, которые можно не писать при импорте
      alias: {                     // переопределяем react → preact
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      },
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map', // карта кода для дебага
    devServer: {
      port: 5173,              // порт локального сервера
      open: true,              // автооткрытие браузера
      hot: true,               // горячая перезагрузка (HMR)
      historyApiFallback: true // поддержка маршрутов SPA
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,          // обработка JS/TS/JSX/TSX файлов
          exclude: /node_modules/,
          use: { loader: 'babel-loader' }, // прогоняем через Babel
        },
        {
          test: /\.css$/,           // обработка CSS
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader', // вынос CSS (prod) или вставка в <style> (dev)
            { loader: 'css-loader', options: { importLoaders: 1 } }, // позволяет импортировать CSS/модули
            'postcss-loader',       // подключает Tailwind + autoprefixer
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i, // обработка изображений
          type: 'asset',                        // автоопределение: inline или файл
          parser: { dataUrlCondition: { maxSize: 8 * 1024 } }, // <8KB — инлайн
        },
        {
          test: /\.(woff2?|ttf|otf|eot)$/i, // обработка шрифтов
          type: 'asset/resource',           // всегда как отдельные файлы
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html', // шаблон HTML
        minify: isProd && { collapseWhitespace: true, removeComments: true }, // минификация (prod)
      }),
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: 'assets/css/[name].[contenthash:8].css' })] // отдельный CSS в prod
        : []),
    ],
  };
};
