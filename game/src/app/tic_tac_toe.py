from tkinter import *
import random

def next(h, w):
    global player
    # خاصنا نتحققو من text ديال الزر
    if table_game[h][w]["text"] == "" and is_winning() == False:

        table_game[h][w].config(text=player)

        if is_winning() == False:
            # تبديل اللاعب (خاص = ماشي ==)
            if player == players[0]:
                player = players[1]
            else:
                player = players[0]
            label.config(text=(player + " turn"))

        elif is_winning() == True:
            label.config(text=(player + " wins"))

        elif is_winning() == 'tie':
            label.config(text="the players tied")

def is_winning():
    # فحص السطور
    for h in range(3):
        if table_game[h][0]["text"] == table_game[h][1]["text"] == table_game[h][2]["text"] and table_game[h][0]["text"] != "":
            return True

    # فحص الأعمدة
    for w in range(3):
        if table_game[0][w]["text"] == table_game[1][w]["text"] == table_game[2][w]["text"] and table_game[0][w]["text"] != "":
            return True

    # فحص الأقطار
    if table_game[0][0]["text"] == table_game[1][1]["text"] == table_game[2][2]["text"] and table_game[0][0]["text"] != "":
        return True

    if table_game[0][2]["text"] == table_game[1][1]["text"] == table_game[2][0]["text"] and table_game[0][2]["text"] != "":
        return True

    # فحص التعادل
    i = 0
    for h in range(3):
        for w in range(3):
            if table_game[h][w]["text"] != "":
                i += 1

    if i == 9:
        return "tie"

    return False

def start_new_game():
    global player
    player = random.choice(players)
    label.config(text=player + " turn")
    for h in range(3):
        for w in range(3):
            table_game[h][w].config(text="")

window = Tk()
window.title("Tic_Tac_Toe_game")

players = ["X", "O"]
player = random.choice(players)

label = Label(window, text=(player + " turn"), font=('consolas', 40), fg="black")
label.pack(side="top")

restart_button = Button(window, text="restart", font=('consolas', 20), fg="green", command=start_new_game)
restart_button.pack(side="top")

buttons_game = Frame(window)
buttons_game.pack()

table_game = [[None]*3 for _ in range(3)]

for h in range(3):
    for w in range(3):
        table_game[h][w] = Button(
            buttons_game,
            text="",
            font=('consolas', 60),
            width=4,
            height=1,
            command=lambda h=h, w=w: next(h, w)
        )
        table_game[h][w].grid(row=h, column=w)

window.mainloop()
