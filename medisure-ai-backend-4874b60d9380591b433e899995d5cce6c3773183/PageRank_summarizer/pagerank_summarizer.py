from summa import summarizer

letterpath= "../resources/denial_letter.txt"

def read_and_summarize(letterpath):
	f= open("../resources/denial_letter.txt","r")
	letter=f.read() 
	summarizer.percentage = 0.9

	result= summarizer.summarize(letter)
	print(result)
	return result




read_and_summarize(letterpath)