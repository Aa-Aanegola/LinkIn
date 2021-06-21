# LinkIn - A portal for all your job needs
LinkIn was designed to emulate LinkedIn in order to learn how to use the MERN stack. It has the basic features that every job application portal should have (described in detail) and a very minimal frontend.  
### Starting the server
The server can be started by running the commands 
```
npm install
node server
```
from the backend directory. 
### Starting the website 
To start the website, navigate to the frontend firectory and execute 
```
npm install
npm start
```
Before starting either the server or the website itself, ensure that node and npm are installed. 
### Features
LinkIn was designed with two main types of users in mind, the applicants and company recruiters. To simplify understanding, the feature set has been broken into groups based on which type of user has access to them. 
#### Common features
- **Registration & Login -** Registration involves specifying the type of user and filling in necessary details. To login, a user requires only their email ID and password. 
- **View profile -** Users can view and edit the information they specified during account creation, this is essentially the home page of the website. Applicants can use this page to update their resume or to add a list of skills they possess. Recruiters can add a bio and contact information. 

#### Applicant specific features
- **View jobs -** A dashboard with all the available jobs, required skills, salary and other important details is visible to the applicants. Fuzzy searching, sorting and filtering help applicants find their desired job faster and more efficiently. 
- **Write SOP - ** If an applicant is interested in a job, they will be prompted to write a statement of purpose which on submission will be visible to the recruiters. If the applicant uploaded a resume to the portal, that will also be visible to the recruiters. 
- **View applications -** After applying for a job, applicants can view all their applications along with their status. Once one of their applications gets accepted, the rest of their applications are automatically invalidated. This is to ensure maximum coverage for all the users of the application. 

#### Recruiter specific features
- **Create listing - ** Recruiters can fill in the required information for a listing and set a valid timeframe. Once the listing is made public, only the deadline / number of possible applicants can be edited. The salary and other details can't be edited after a listing is made public to ensure that the system is fair to the applicants. 
- **View listings -** Recruiters can view listings they created, and can navigate to a page with all the active applications for the listing. Here they can view the SOP and resume of applicants and decide to accept/reject/shortlist applicants. If they choose to accept an applicant, an email that details their acceptance is sent to the applicant. 
- **View employees -** Recruiters can also view all the employees with their job information. Fuzzy searching, filters and sort functionality help recruiters find the employee they want faster. 

### Backend information
The backend for the website was created using express and MongoDB was used to store information. 
#### Database
The schema for the database can be found in the ```models``` directory within the ```backend``` directory. There are 3 tables in the database as described below:
- ```User``` - User information (for both recruiters and applicants) are stored in this table. 
- ```Listing``` - Listings are created by recruiters and contain listing information along with a recruiter email ID. This is done to facilitate retrieval of all listings created by a particular recruiter. 
- ```Application``` - Similar to a listing, applications contain application information along with the applicants email ID and the listing ID as retrieval based on listing is also required. 

#### API's
All the API's are in the ```routes``` folder within the ```backend directory```. The API's are divided into files based on their purpose and are detailed in the files itself. 

### Frontend information
The frontend was created using the React framework, and all the components are within the ```components``` directory inside the ```frontend``` directory. 
