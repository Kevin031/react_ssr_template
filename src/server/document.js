export default ({ appString, js, styles, helmet, stores }) => `
<!doctype html>
<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <link href="/css/font-awesome.min.css" rel="stylesheet">
    <link href="/css/bootstrap.min.css" rel="stylesheet">

    ${styles}

    ${helmet.title.toString()}
</head>
<body>

  <div id="react-root">${appString}</div>

  <script>window.__init_states__ = ${stores}</script>
  ${js}

</body>
</html>
`
