
# #os.remove('C:\Users\c\djangoproj\locallibrary\catalog\p.py')

# with open('C:/Users/c/djangoproj/locallibrary/catalog/p.py', 'r+') as f:
#     line=f.readline()
#     lineln=len(line)
#     print(lineln)
#     print(line)
#     for ch in range(lineln):
#         if line[ch] == '=':
#            line=line[:ch]+" "+line[ch]+" "+line[ch+1:]
#            lineln+=len(line)-lineln

#         print(line[ch])
#     f.write(line)        
#     print(line)

with open('C:/Users/c/djangoproj/locallibrary/catalog/tests/test_views.py', 'r+') as f:
    lines=f.read()
    lines=lines.replace("password='2HJ1vRV0Z&3iD')", "password = 'word')test",)
    f.truncate(0)
    f.seek(0)
    f.write(lines)
    print(lines)
                
        