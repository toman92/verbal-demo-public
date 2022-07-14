# Verbal

## Getting Started

---

### Frameworks

- Backend application has been created with Express, Prisma (ORM) and MySQL.
- Frontend application has been created with React and React State Hooks.
- Prisma generated entities are shared across both the backend and frontend.

### 1) Pre-requisites

- **Docker**:

  - [Mac](https://runnable.com/docker/install-docker-on-macos)
  - [Windows](https://runnable.com/docker/install-docker-on-windows-10)
  - [Linux](https://runnable.com/docker/install-docker-on-linux)
    (requires separate install [Docker Compose](https://docs.docker.com/compose/install/))

- **Node 14**
  - Mac / Linux (via [nvm](https://github.com/nvm-sh/nvm)):
    ```
    $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    $ nvm install 14
    $ nvm alias default 14
    ```
  - [Windows](https://nodejs.org/en/)
  - Ubuntu (via snap):
    ```
    $ sudo snap install node --channel 14/stable --classic
    ```

### 2) Clone The Monolith

```
$ git clone https://github.com/toman92/verbal-demo-public VerbalDemo
```

### 3) Start Your Dev Server

```
$ cd VerbalDemo
$ ./run.sh -i -s
```

Note that if (re)installing dependencies is not required, the `-i` flag can be dropped for a much faster launch.
Similarly, if seeding is not desired, omit the `-s` flag.
See `./run.sh -h` for more information and options.

Projects can be installed and started independently using `npm ci` and `npm run start` respectively
in either`./admin-api.theverbal.co` (crm api) or `./admin.theverbal.co` (crm ui) if required.

#### Development Credentials for each role

| System      | Role          | Email              | Password |
| ----------- | ------------- | ------------------ | -------- |
| Admin | Administrator | `admin@verbal.com` | `verbal`  |
| StoryAdmin | Story Administrator | `story@verbal.com` | `verbal` |
| Coordinator | Coordinator | `coordinator@theverbal.co` | `verbal` |


## **Task** - Around 5 hours (this includes installing the required software/tools/dependencies)
This task is laid out in the format used by Verbal. There is a user story which outlines who this functionality is for, the desired outcome and why it is needed. The user story is followed by some functional and non-functional requirements that should guide the developer on what should be done to achieve the desired outcome. For the purposes of recruitment this task has been deliberately broken up into multiple parts. You should attempt to complete every part in the time frame but we would advise not to go beyond the time frame as this is not a speed test. While undertaking this task, please keep note of any issues or problems you came across and how you handled or attempted to handle each of them. 

### **User Story** (Who, Outcome, Why)
As a story admin, I want to be able to see how many stories have been added to the system in the past 30 days so I can get an understanding of the turn around time for adding new stories

### **Requirements** 
- Widget must show on the dashboard (/dashboard route).
- Must show stories added within the past 30 days.
- Must have appropriate label
- Should be mobile responsive.
- Should not be displayed to Coordinator roles

### **Task guide**
1. When you have the repo locally, create a new branch named after yourself. eg. SeanToman
2. Treat this branch as your master branch. Create more branches if needed from this and merge commits into it.
3. When you start the development server using the run script with the -i and -s flag, your local database will be seeded with all the data you need to carry out this task.
4. You can start on either the backend or the frontend. It is entirely up to you and has no bearing on the final result
5. Frontend work:  
    a. Create Widget component to show stories added within the past 30 days.  
    b. Get widget data from server to display in the Widget component  
    c. Style with CSS, SASS or Material UI themes as you like but it should be mobile responsive.  
6. Backend work:  
    a. Create or modify endpoints to get how many stories have been added in the past 30 days.  
    b. Write or update unit tests for the new functionality.  
7. Some Tips:  
    a. Keep DRY (Don't Repeat Yourself) principles in mind while developing. Eg. Check if you can reuse or modify existing components/functions before developing new ones.  
    b. Keep the requirements in mind while development.   
    c. Don't have unused imports or variables. Make use of the lint script in each of the `package.json` files to help with this.
8. When complete, push the branch with your name up to github and send an email to sean@theverbal.co to notify that you have completed the task.

## **Contact**
If you have any issues, questions/queries or want to talk about anything, please don't hesitate to contact Sean at sean@theverbal.co. I will be glad to answer any questions you may have.

Best of luck and happy coding :) 