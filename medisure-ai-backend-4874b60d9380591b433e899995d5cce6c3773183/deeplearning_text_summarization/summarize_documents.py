from summarizer import Summarizer

letterpath= "../resources/denial_letter.txt"

def read_and_summarize(letterpath):
	f= open("../resources/denial_letter.txt","r")
	letter=f.read()
	model = Summarizer()
	#result1 = model(letter, ratio=0.1)  # pass ratio
	result2 = model(letter, num_sentences=6)  # Will return 6 sentences 

	print (result2)

	return result2


read_and_summarize(letterpath)