#         创建一个依次包含键-值对`{'name': 'Niuniu'和'Student ID': 1}`的字典`my_dict_1`，</br>
# 创建一个依次包含键-值对`{'name': 'Niumei'和'Student ID': 2}`的字典`my_dict_2`，</br>
# 创建一个依次包含键-值对`{'name': 'Niu Ke Le'和'Student ID': 3}`的字典`my_dict_3`，</br>
# 创建一个空列表`dict_list`，使用`append()`方法依次将字典`my_dict_1`、`my_dict_2`和`my_dict_3`添加到`dict_list`里，</br>
# 使用`for`循环遍历`dict_list`，对于遍历到的字典，使用`print()`语句一行输出类似字符串`"Niuniu's student id is 1."`的语句以打印对应字典中的内容。
class Problem69:
    def __init__(self):
        self.problem_69()
        
    def problem_69(self):

        my_dict_1 = {'name': 'Niuniu', 'Student ID': 1}
        my_dict_2 = {'name': 'Niumei', 'Student ID': 2}
        my_dict_3 = {'name': 'Niu Ke Le', 'Student ID': 3}
        dict_list = []
        dict_list.append(my_dict_1)
        dict_list.append(my_dict_2)
        dict_list.append(my_dict_3)
        for dict in dict_list:
            print(f"{dict['name']}'s student id is {dict['Student ID']}")
    


if __name__ == '__main__':
    obj = Problem69()