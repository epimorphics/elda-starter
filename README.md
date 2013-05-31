elda-starter
============

Sample Elda Starter project to be 'forked' and customised as required.

Getting Started
---------------
To get started with this project:

  cd <someplace>
  git clone https://github.com/epimorphics/elda-starter.git elda-starter
  cd elda-starter
  sudo cp -Rvf etc/elda /etc/elda
  mvn clean package tomcat6:run

This should download and checkout, build and run the project. By default the Elda installion should 
appear on port 8080. Visit [http://localhost:8080](http://localhost:8080 "Sample landing page") for signs of life.
Click on one of the links on the landing page (eg. [/anything](http://localhost:8080/anything "Anything endpoint) ). 
This should return a page of HTML that presents some data in a tabular form.

If you have got this far you have a working setup and you are now ready to start working on your own LDA configurations.

The etc directory that you copied in the sudo'd step above copied some sample configuration in to a place where elda 
has been configured to look for them.

As configured for this project, elda will pickup and use files that match the following pattern:

  /etc/elda/conf.d/ROOT/*.ttl
  
You should find that the single file:

  /etc/elda/conf.d/ROOT/config.ttl

which contains the definition of 3 LDA endpoints

  /anything
  /about?resource={uri}
  /mentions?resource={uri}
  
  
  
