from package.view import View
from package.operation import Operation


class Main():
    @staticmethod
    def run():
        
        if View.login():
            
            obj = Operation()
            while True:
                choice = input("请选择需要办理的业务:")
                if choice == '1':
                    pass
                elif choice == '2':
                    pass
                elif choice == '3':
                    pass
                elif choice == '4':
                    pass
                elif choice == '5':
                    pass
                elif choice == '6':
                    pass
                elif choice == '7':
                    pass
                elif choice == '8':
                    pass
                elif choice == '9':
                    pass
                elif choice == '0':
                    obj.save()
                    break


if __name__ == "__main__":
    Main.run()
