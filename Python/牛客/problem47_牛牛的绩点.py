class Problem47:
    def __init__(self):
        self.problem_47()
    
    def problem_47(self):
        xuefen_dict = {'A':4.0, 'B':3.0, 'C':2.0, 'D':1.0, 'E':0.0}
        xf_jd = []
        while True:
            xuefen = input()
            if xuefen == 'False': 
                break
            jidian = input()  
            res = xuefen_dict[xuefen] * float(jidian)
            xf_jd.append(res)
            
        xf_jd = list(map(int, xf_jd))
        print(sum(xf_jd) / (len(xf_jd)**2))
if __name__ == "__main__":
    Problem47()