import requests as req


res = req.get('https://gitee.com/chinabugotech/hutool/blob/v5-master/README.md')
print(res.status_code == req.codes.ok)
print(len(res.text))
print(res.text)

with open('README.html', 'w+', encoding='utf-8') as f:
    f.write(res.text)
