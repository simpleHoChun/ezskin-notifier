# ezskin-notifier

一個掛不到號想上車的宅宅寫的[輕鬆美膚](https://www.ezskin.com.tw)門診餘額通知。

> 初診預約前請先閱讀 [靠腰懶人包大集合](https://www.facebook.com/notes/%E8%BC%95%E9%AC%86%E7%BE%8E%E8%86%9A/%E9%99%B3%E7%9A%AE%E9%9A%94%E9%9B%B7%E9%9D%A0%E8%85%B0%E6%87%B6%E4%BA%BA%E5%8C%85%E5%A4%A7%E9%9B%86%E5%90%88/1542506099094333/)

## Usage

Clone and go into this repository

```
$ git clone https://github.com/kingispeak/ezskin-notifier
$ cd ezskin-notifier
```

Install dependencies and update .env

```
$ npm install or yarn install
$ cp .example.env env`
```

Run

```
$ npm start or yarn start
```

Result:

```js
[
    { date: '10/28(日)', morning: '', afternoon: '', night: '' },
    {
        date: '10/29(一)',
        morning: '休診',
        afternoon: '賴碧芬   額滿',
        night: '陳衍良   額滿'
    },
    {
        date: '10/30(二)',
        morning: '休診',
        afternoon: '休診',
        night: '陳衍良   額滿'
    },
    {
        date: '10/31(三)',
        morning: '休診',
        afternoon: '陳衍良   額滿',
        night: '賴碧芬   額滿'
    },
    {
        date: '11/1(四)',
        morning: '休診',
        afternoon: '陳衍良   額滿',
        night: '休診'
    },
    { date: '11/2(五)', morning: '', afternoon: '', night: '' },
    {
        date: '11/3(六)',
        morning: '陳衍良   額滿',
        afternoon: '休診',
        night: '休診'
    },
    { date: '11/4(日)', morning: '', afternoon: '', night: '' }
];
```
