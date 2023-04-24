# react-setting
- CRA를 사용하지 않고 직접 셋팅 진행
- React + Typescript
<br/>
<br/>
<br/>

## 1. react, react-dom 설치
```
npm init -y
npm install react react-dom
```

## 2. webpack 설치
```
npm install --save-dev webpack webpack-bundle-analyzer webpack-cli webpack-dev-server webpack-merge
```   
#### ※ webpack-bundle-analyzer   
- 번들에서 어떠한 파일이 얼마나 용량을 차지하는지 알 수 있음
- 각 파일 별 비중을 시각화(차트)하여 쉽게 파악할 수 있음
- 분석 결과를 토대로 꾸준히 개선/확인하는 것이 필요함!
- plugins에 실행 코드 추가 후, 빌드하면 dist 폴더(outDir) 내에 bundle-report.json 파일 생성됨.   
해당 파일이 있어야만 webpack-bundle-analyer 실행이 가능함! (먼저 빌드해야 함!!)
- https://github.com/webpack-contrib/webpack-bundle-analyzer
- https://satisfactoryplace.tistory.com/359


<br/>
<br/>
<br/>

## 3. module, loader 셋팅
```
// babel
npm install --save-dev @babel/cli @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader core-js

// css
npm install --save-dev css-loader css-minimizer-webpack-plugin mini-css-extract-plugin style-loader sass sass-loader

// 그 외 plugin
npm install --save-dev html-webpack-plugin terser-webpack-plugin
```
<br/>

#### ※ css-minimizer-webpack-plugin
- css를 최적화하고 축소하는 역할을 하는 플러그인
- cssnano를 이용함
- https://webpack.js.org/plugins/css-minimizer-webpack-plugin/

<br/>

#### ※ mini-css-extract-plugin
- css를 별도의 파일로 추출함
- css를 포함하는 js 파일마다 css 파일을 생성함
- css 및 sourcemaps 의 on-demand 로딩을 지원함    
(on-demand 로딩: lazyloading, 요청이 있을 때 로드하는 것)
- https://webpack.js.org/plugins/mini-css-extract-plugin

<br/>

#### terser-webpack-plugin
- terser를 이용해 js 파일을 축소/최소화 하는 플러그인
- (terser) es6+를 위한 압축기(mangler/compressor) 툴킷, uglify-es에서 포크를 따 만듬
- webpack5는 최신 terser-webpack-plugin을 함께 제공하고 있으나,   
webpack5 이상의 버전을 사용하거나 옵션을 커스터마이징할 경우 plugin 설치해야 함

<br/>
<br/>
<br/>

## 4. Typescript 설치
```
npm install --save-dev @types/react @types/react-dom typescript
```

<br/>
<br/>
<br/>

## 5. Jest 설치 (ts-jest)
```
npm install --save-dev jest ts-jest @types/jest
```
- https://github.com/kulshekhar/ts-jest


<br/>
<br/>
<br/>

## 6. 프로젝트 구조
```
root
- config
    |
    -- webpack.common.js
    -- webpack.dev.js
    -- webpack.prod.js
- node_modules
- public
    |
    -- index.html
- src
    |
    -- App.tsx
    -- index.tsx
- .babelrc
- package.json
- tsconfig.json
- package-lock.json
```

<br/>
<br/>
<br/>

## 7. webpack 셋팅
- webpack-merge를 이용하여 webpack.dev.js, webpack.prod.js에 webpack.common.js를 병합함
- 개발 시 webpack-dev-server를 사용하고, 빌드 시 output 설정 등 모드에 따라 셋팅을 분리하여 관리할 수 있도록 구성함
- config 폴더 내 파일 참고

<br/>

#### ※ webpack.common.js

<br/>

##### ※ dist/js, dist/css 폴더 분리 필요할 때!
```
const RemoveEmptyScripts = require('webpack-remove-empty-scripts');
...
entry: {
    '/js/main': `${path.resolve(__dirname, '../src')}/ts/main.tsx`,
    '/css/main': `${path.resolve(__dirname, '../src')}/scss/main.scss`
},
plugins: [
    new RemoveEmptyScripts(),
    ...
]
```
- entry에서 key값으로 '폴더명/파일명' 설정한다.
- css의 경우 빈 js 파일도 생성되므로, 이를 지워주는 플러그인인 'RemoveEmptyScripts'를 설치하여 실행한다.
- 위와 같이 설정하였을 때, optimization.splitChunks.chunks: 'all' / 'initial'로 설정 시 react 및 라이브러리들은 별도 청크파일로 변환되고, src/ts 코드들은 entry에서 지정한 파일명으로 번들됨
- chunks: 'async'로 변경하면 하나의 파일로 번들됨

<br/>

##### ※ babel-loader만 사용하고, ts-loader를 사용하지 않는 이유?!
```
module: {
    rules: [
        {
            test: /\.(ts|tsx|js|jsx)$/,
            use: 'babel-loader',
            exclude: /node_modules/
        },
```
- babel7부터는 ts-loader가 필요없으며, babel이 typescript를 제거/처리함으로써 성능이 훨씬 빠르다고 함    
(단, transpile 용으로만, 타입 체크는 해주지 않음)   
- <b>단, @babel/preset-typescript 프리셋이 필요함 (타입 구문 인식 및 제거용)</b>
- <b>babel에서 타입 체크는 진행하지 않음(tsc에서 별도로 진행 필요)</b>   
```Keep in mind that Babel doesn't do type checking; you'll still have to install and use Flow or TypeScript to check types.```   
https://babeljs.io/docs/#type-annotations-flow-and-typescript
- ts-loader에서는 compiler 옵션을 통해 tsc로 compile한다고 함(타입체크 + emit(옵션 활성화 시))
- https://ui.toast.com/weekly-pick/ko_20181220
- https://victor-log.vercel.app/post/babel-loader-and-ts-loader-and-esbuild-loader/

<br/>

##### ※ plugin 설정 

```
plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
        template: 'public/index.html'
    }),
    // 모든 곳에서 모듈을 import/require 하지 않고 자동적으로 모듈을 로드하는 플러그인 
    new webpack.ProvidePlugin({ 
        React: 'react'
    }),
    // 
    new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: 'bundle-report.json'
    })
],
```
- https://webpack.js.org/plugins/provide-plugin

<br/>

##### ※ 이미지 사용 시 src 폴더 구조대로 dist 폴더에 생성되도록 하는 방법
```
module: {
    rules: [
        ...
        {
            test: /\.(ico|png|jpe?g|gif|svg)$/,
            type: 'asset/resource',
            generator: {
                // img 폴더 바로 하위에 모든 파일이 들어옴
                //filename: 'img/[name][ext]' 

                // pathData에서 폴더 경로가 포함된 filename 추출하여 사용함
                filename(pathData) {
                    const { filename } = pathData || {};
                    return filename ? filename.replace('src', '') : filename;
                }
            }
        }
    ]
}
```

<br/>

#### ※ webpack.dev.js
```
devServer: {
    open: true,
    hot: true,
    compress: true, // gzip 압축 활성화
    port: 8080,
    historyApiFallback: true, // html5 history api 사용 시, 404 대신 index.html을 바라보도록 설정
    liveReload: true
}
```
- https://webpack.kr/configuration/dev-server/ 
- https://github.com/bripkens/connect-history-api-fallback


<br/>

#### ※ webpack.prod.js
```
optimization: {
    usedExports: true, // 사용하지 않는 export 제거
    minimize: true, // 번들 최소화 (terser plugin 또는 minimizer에 지정된 플러그인 사용함)
    minimizer: [ // 번들 최소화 도구 지정
        new TerserPlugin({
            terserOptions: {
                compress: {
                    drop_console: true
                }
            },
            extractComments: true // 주석을 모아 LICENSE.txt 파일 생성함
        }),
        new CssMinimizerPlugin()
    ],
    splitChunks: { // 동적으로 가져온 모듈에 청크 전략을 사용할 수 있음
        chunks: 'all' // all: 모든 유형의 청크 포함(비동기 청크와 동기 청크 간에도 청크 공유 가능)
    }
}
```
- https://webpack.kr/configuration/optimization

<br/>
<br/>
<br/>

## 8. babel 셋팅
```
{
    "presets": [
        "@babel/preset-react",
        [
            "@babel/preset-env",
            {
                "modules": false,
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ],
        "@babel/preset-typescript"
    ]
}
```
- (@babel/preset-react) react의 jsx 구문 인식 및 transfiling 하기 위해 사용
- (@babel/preset-env) 
    - babel7부터는 필수 preset   
    - 최신 자바스크립트를 사용하면 타겟 브라우저/환경에 맞춰 transfiling 해줌
    - babel-preset-es2015 -> babel-preset-env로 변경됨
    - (modules) 모듈 구문을 다른 모듈 타입으로 변환할 수 있음    
    (amd/umd/systemjs/commonjs/cjs/auto(default)/false: 사용하던 모듈이 보존됨)
    - (useBuiltIns) 폴리필 처리 방법을 구성함   
    usage/entry 옵션은 core-js를 직접 참조하므로 core-js에 접근할 수 있어야 한다(core-js 설치 필요)
    - https://babeljs.io/docs/env
    - https://babeljs.io/docs/babel-preset-env

<br/>
<br/>
<br/>

## 9. tsconfig.json 셋팅
```
// tsconfig.json 생성 (직접 생성도 가능)
npx tsc init

// tsconfig.json 구성
```

- tsc(typescript compile) 할 때, js 파일 제공 없이 .d.ts 파일만 생성하고 싶을 때
    ```
        "declaration": true,
        "declarationDir": "./dist/types",
        "emitDeclarationOnly": true, // .d.ts 만 내보내는 옵션
        "noEmit": false, // js 파일 내보내지 않으려면 true를 해야하지만, declaration 뽑으려면 false로 해야 함
    ```



<br/>
<br/>
<br/>

## 10. jest 셋팅
```
npx ts-jest config:init
```
- jest.config.js 생성
- https://github.com/kulshekhar/ts-jest


<br/>
<br/>
<br/>

## 11. package.json scripts 추가
```
{
    ...
    scripts: {
        "dev": "webpack-dev-server --config config/webpack.dev.js",
        "build": "webpack --config config/webpack.prod.js",
        "tsc": "tsc",
        "test": "jest",
        "analyze": "webpack-bundle-analyzer ./dist/bundle-report.json --default-sizes gzip"
    }
}
```

<br/>
<br/>
<br/>

## 12. index.html 생성 및 코드 작성
- public/index.html 참고

<br/>
<br/>
<br/>

## 13. index.tsx, App.tsx 생성 및 코드 작성

#### ※ index.tsx - DOM에 엘리먼트 렌더링하는 코드 작성   
```
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container as Element);

root.render(<App />);
```
- ReactDOM.createRoot 타입 이슈 발생 -> createRoot는 react-dom/client 내에 위치함   
(client.d.ts 연결하거나 지금처럼 createRoot 추출해서 사용하기)
- https://ko.reactjs.org/docs/rendering-elements.html
- https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43848


<br/>
<br/>
<br/>

# 참고
### CRA 없이 React 셋팅하는 법
- https://medium.com/@JedaiSaboteur/creating-a-react-app-from-scratch-f3c693b84658
- https://ryuhojin.tistory.com/19

<br/>
<br/>