# Todo with React and Django
This is created as a software demo for Frontend and Backend integration as part of MVC/MVVM and Communications workshop of Coders for Causes

## How to run

1. Have Python and NPM installed
2. run `pip install -r requirements.txt`
3. Go to `/frontend`, and run `npm run build`
4. Go back to root folder, and run `python manage.py runserver`

## Features

- at `localhost:8000`, you will see the frontend
- at `localhost:8000/api`, you will see the interactive Django Rest Framework stuff

## Most Important Files

- `frontend/App.js` contains the frontend (View) + the integration logic (ViewModel)
- `api/models.py` contains the database logic (Model)
- `urls.py` and `views.py` contains endpoint routing logic and views (ViewModel)