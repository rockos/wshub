#!/bin/sh

# バックアップファイルを何日分残しておくか
period=7
# バックアップファイルを保存するディレクトリ
dirpath="/home/locos/project/snowshoe/var/save"

# ファイル名を定義(※ファイル名で日付がわかるようにしておきます)
filename=`date +%y%m%d`

# mysqldump実行
mysqldump --opt --user=locos --password=land0522 somali > $dirpath/$filename.sql

# パーミッション変更
chmod 700 $dirpath/$filename.sql

# 古いバックアップファイルを削除
oldfile=`date --date "$period days ago" +%y%m%d`
rm -f $dirpath/$oldfile.sql
