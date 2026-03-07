import argparse
import pymysql

def main(): 
    """
    # STUB
    description: 创建一个ArgumentParser实例
    param: prog -> 程序名; description -> 描述; epilog -> 说明信息

    
    """
    parser = argparse.ArgumentParser(prog='backup',description='Backup MySQL Database.', epilog='Copyright(r), 2023')
    parser.add_argument('outfile')  # NOTE 定义位置参数
    parser.add_argument('--host', default='localhost')  # NOTE 定义关键字参数
    parser.add_argument('--port', default=3306, type=int)  # NOTE 参数的类型
    parser.add_argument('-u', '--user', required=True)  # NOTE 允许用户输入简写的 "-u"
    parser.add_argument('-p', '--password', required=True)
    parser.add_argument('--database', required=True)  #NOTE gz参数不跟参数值,因此指定 store_true, 意思是出现gz表示True
    parser.add_argument('-gz', '--gzcompress', action='store_true', required=False,help='Compress backup file by gz.')
    
    args = parser.parse_args()
    
    print("parse args: ")
    print(f"outfile = {args.outfile}")
    print(f"host = {args.host}")
    print(f"port = {args.port}")
    print(f"user = {args.user}")
    print(f"password = {args.password}")
    print(f"database = {args.database}")
    print(f"gzcompress = {args.gzcompress}")
    return args
    
def connection_and_createtable(args):
    conn = None
    cursor = None
    try:
        conn = pymysql.connect(
            host=args.host, 
            port=args.port, 
            user=args.user, 
            password=args.password, 
            database=args.database, 
            charset="utf8mb4"
        )
        cursor = conn.cursor()
        create_table = "CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) NOT NULL UNIQUE, email VARCHAR(100) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
        cursor.execute(create_table)
        conn.commit()
        print("表创建成功！")
    except pymysql.Error as e:
        print(f"数据库错误：{e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    
if __name__ == "__main__":
    args = main()
    connection_and_createtable(args)