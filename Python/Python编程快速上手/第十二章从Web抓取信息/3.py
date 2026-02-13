import requests as rq, bs4 as bs


res = rq.get('https://gitee.com/iGaoWei/big-data-view/blob/master/view.html')
res.raise_for_status()
noStarchSoup = bs.BeautifulSoup(res.text, 'html.parser')


