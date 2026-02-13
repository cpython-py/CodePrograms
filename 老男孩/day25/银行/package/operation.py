import os
import pickle


class Operation():
    def __init__(self):
        self.load_user()
        self.load_userid()

    def load_user(self):
        if os.path.exists("user.txt"):
            with open("user.txt", "rb") as fp:
                self.user_dict = pickle.load(fp)
        else:
            self.user_dict = {}
        print(self.user_dict)
    def load_userid(self):
        if os.path.exists("userid.txt"):
            with open("userid.txt", "rb") as fp:
                self.user_id_dict = pickle.load(fp)
        else:
            self.user_id_dict = {}
        print(self.user_id_dict)
    def save(self):
        # 存储user_dict字典
        user_dict = {"111222": 100}
        user_id_dict = {"123456": "111222"}
        
        with open("user.txt", "wb") as fp:
            pickle.dump(self.user_dict, fp)
        
        # 存储user_id_dict字典
        with open("userid_txt", "wb") as fp:
            pickle.dump(self.user_id_dict, fp)
