let first_name = ["이", "김", "한", "차", "남"];
let last_name = [
  "가람",
  "가온",
  "그린",
  "겨루",
  "나래",
  "늘봄",
  "다슬",
  "라라",
  "루리",
  "마루",
  "바다",
  "새길",
  "새나",
];

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      let r = (Math.random() * 16) | 0;
      let v = c == "x" ? r : randomItem(["A", "B", "C"]);
      return v.toString(16);
    }
  );
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateData(template, index) {
  return template.replace(/{{([^{}]+)}}/g, function (_, key) {
    // key 값은 중괄호 안에 들어있는 값
    // console.log(key)
    const func = key.split("(")[0];
    const [...args] = key
      .split("(")[1]
      .replace(")", "")
      .replaceAll(" ", "")
      .replaceAll("'", "")
      .replaceAll('"', "")
      .split(",");
    // console.log(func, args)

    switch (func) {
      case "id":
        return uuid();
      case "index":
        return index;
      case "integer":
        return randomInteger(parseInt(args[0]), parseInt(args[1]));
      case "random":
        return randomItem(args.map((s) => s.replace(/"/g, "").trim()));
      case "name":
        return randomItem(first_name) + randomItem(last_name);
      default:
        return _;
    }
  });
}

document
  .getElementById("generate-button")
  .addEventListener("click", function () {
    // let input = JSON.parse(document.getElementById('json-input').value.replace(/'/g, '"'));
    let input = `[
    "{{repeat(5)}}",
    {
        "_id": "{{id()}}",
        "index": "{{index()}}",
        "picture": "http://via.placeholder.com/32x32",
        "age": "{{integer(20, 40)}}",
        "eyeColor": "{{random('blue', 'brown', 'green')}}",
        "name": "{{name()}}"
    }]`;
    input = JSON.parse(input);
    console.log(input);

    let repeatCount = parseInt(input[0].match(/(\d+)/)[0]);
    console.log(repeatCount);

    let template = JSON.stringify(input[1]);
    console.log(template);

    let output = [];
    console.log(repeatCount);

    for (let i = 0; i < repeatCount; i++) {
      output.push(JSON.parse(generateData(template, i)));
    }
    console.log(output);

    document.getElementById("json-output").value = JSON.stringify(
      output,
      null,
      2
    );
  });

// json-output Indent 설정
document.getElementById("json-indent").addEventListener("change", function () {
  let indentValue = this.value;
  let output = document.getElementById("json-output").value;
  if (output) {
    let parsedOutput = JSON.parse(output);
    document.getElementById("json-output").value = JSON.stringify(parsedOutput, null, parseInt(indentValue));
  }
});



// csv 다운로드 버튼 클릭시 이벤트
document
  .getElementById("downloadcsv-button")
  .addEventListener("click", function () {
    // json-output textarea의 값을 가져온다.
    let json = document.getElementById("json-output").value;
    // json을 객체로 변환한다.
    let data = JSON.parse(json);
    // csv 파일의 첫번째 줄에 들어갈 키를 추출한다.
    let keys = Object.keys(data[0]);
    // csv 파일의 첫번째 줄을 만든다.
    let csv = keys.join(",") + "\n";
    // csv 파일의 두번째 줄부터 데이터를 넣는다.
    data.forEach(function (row) {
      // csv 파일의 한 줄을 만든다.
      let line = keys
        .map(function (key) {
          return row[key];
        })
        .join(",");
      // csv 파일에 한 줄을 추가한다.
      csv += line + "\n";
    });
    // csv 파일을 다운로드한다.
    download("data.csv", csv);
  });

// json 다운로드 버튼 클릭시 이벤트
document
  .getElementById("downloadjson-button")
  .addEventListener("click", function () {
    // json-output textarea의 값을 가져온다.
    let json = document.getElementById("json-output").value;
    // json 파일을 다운로드한다.
    download("data.json", json);
  });

// html 다운로드 버튼 클릭시 이벤트
document
  .getElementById("downloadhtml-button")
  .addEventListener("click", function () {
    // json-output textarea의 값을 가져온다.
    let json = document.getElementById("json-output").value;
    // json을 객체로 변환한다.
    let data = JSON.parse(json);
    // html 파일을 만든다.
    let html = "<table>\n";
    // html 파일의 첫번째 줄에 들어갈 키를 추출한다.
    let keys = Object.keys(data[0]);
    // html 파일의 첫번째 줄을 만든다.
    html += "\t<tr>\n";
    // html 파일의 첫번째 줄에 키를 넣는다.
    keys.forEach(function (key) {
      html += "\t\t<th>" + key + "</th>\n";
    });
    // html 파일의 첫번째 줄을 닫는다.
    html += "\t</tr>\n";
    // html 파일의 두번째 줄부터 데이터를 넣는다.
    data.forEach(function (row) {
      // html 파일의 한 줄을 만든다.
      html += "\t<tr>\n";
      // html 파일의 한 줄에 데이터를 넣는다.
      keys.forEach(function (key) {
        html += "\t\t<td>" + row[key] + "</td>\n";
      });
      // html 파일의 한 줄을 닫는다.
      html += "\t</tr>\n";
    });
    // html 파일을 닫는다.
    html += "</table>";
    // html 파일을 다운로드한다.
    download("data.html", html);
  });

// xml 다운로드 버튼 클릭시 이벤트
document
  .getElementById("downloadxml-button")
  .addEventListener("click", function () {
    // json-output textarea의 값을 가져온다.
    let json = document.getElementById("json-output").value;
    // json을 객체로 변환한다.
    let data = JSON.parse(json);
    // xml 파일을 만든다.
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    // xml 파일의 첫번째 줄에 들어갈 키를 추출한다.
    let keys = Object.keys(data[0]);
    // xml 파일의 첫번째 줄을 만든다.
    xml += "<rows>\n";
    // xml 파일의 두번째 줄부터 데이터를 넣는다.
    data.forEach(function (row) {
      // xml 파일의 한 줄을 만든다.
      xml += "\t<row>\n";
      // xml 파일의 한 줄에 데이터를 넣는다.
      keys.forEach(function (key) {
        xml += "\t\t<" + key + ">" + row[key] + "</" + key + ">\n";
      });
      // xml 파일의 한 줄을 닫는다.
      xml += "\t</row>\n";
    });
    // xml 파일을 닫는다.
    xml += "</rows>";
    // xml 파일을 다운로드한다.
    download("data.xml", xml);
  });

// sql query 다운로드 버튼 클릭시 이벤트
document
  .getElementById("downloadsql-button")
  .addEventListener("click", function () {
    // json-output textarea의 값을 가져온다.
    let json = document.getElementById("json-output").value;
    // json을 객체로 변환한다.
    let data = JSON.parse(json);
    // sql query 파일을 만든다.
    let sql = "INSERT INTO table_name (";
    // sql query 파일의 첫번째 줄에 들어갈 키를 추출한다.
    let keys = Object.keys(data[0]);
    // sql query 파일의 첫번째 줄을 만든다.
    sql += keys.join(", ") + ") VALUES\n";
    // sql query 파일의 두번째 줄부터 데이터를 넣는다.
    data.forEach(function (row, index) {
      // sql query 파일의 한 줄을 만든다.
      sql += "\t(";
      // sql query 파일의 한 줄에 데이터를 넣는다.
      keys.forEach(function (key) {
        sql += "'" + row[key] + "', ";
      });
      // sql query 파일의 한 줄을 닫는다.
      sql = sql.slice(0, -2) + ")";
      // sql query 파일의 한 줄을 닫는다.
      sql += index === data.length - 1 ? ";" : ",";
      // sql query 파일의 한 줄을 닫는다.
      sql += "\n";
    });
    // sql query 파일을 다운로드한다.
    download("data.sql", sql);
  });

function download(filename, text) {
  // a 태그를 만든다.
  let element = document.createElement("a");
  // href 속성을 추가한다.
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  // download 속성을 추가한다.
  element.setAttribute("download", filename);
  // a 태그를 클릭한다.
  element.click();
}