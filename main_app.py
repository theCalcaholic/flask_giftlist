from flask import Flask, render_template, request
from werkzeug.contrib.fixers import ProxyFix
import os

app = Flask(__name__)

@app.route('/')
def index():
	#with os.open('count.txt', os.O_) as count_file:
	#	current_number = count_file.readlines()[0].strip()
	        
	return render_template('preliminary.htm')
	
"""@app.route('/set/')
def set_progress():
	with open('current_progress.txt') as progress_file:
		current_progress = progress_file.readlines()[0].strip()
	return render_template('set.htm', progress=current_progress)

@app.route('/save/', methods=['GET', 'POST'])	
def save_progress():
	if request.method == 'POST' and is_valid(request.form['pw']):
		if request.form['progress'].isdigit():
			progress_file = os.open('current_progress.txt', os.O_WRONLY)
			os.write(progress_file, request.form['progress'])
			os.close(progress_file)
			return render_template("save.htm", status="New Progress successfully saved!")
		else:
			return render_template("save.htm", status="Invalid number format!")
	else:
		return render_template("save.htm", status="Access not permitted!")

def is_valid(password):
	with open('pw.txt') as pw_file:
		pw = pw_file.readlines()[0]
		return pw.strip() == password.strip()"""
		
	
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
	
app.wsgi_app = ProxyFix(app.wsgi_app)
	
if __name__=='__main__':
	app.run(debug=False)
