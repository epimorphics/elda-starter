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
Click on one of the links on the landing page eg. [/anything](http://localhost:8080/anything "List anything..."). 
This should return a page of HTML that presents some data in a tabular form.

Sample LDA configuration
------------------------
If you have got this far you have a working setup and you are now ready to start working on your own LDA configurations.

The etc directory that you copied in the sudo'd step above copied some sample configuration in to a place where elda 
has been configured to look for them.

As configured for this project, elda will pickup and use files that match the following pattern:

    /etc/elda/conf.d/ROOT/*.ttl
  
You should find that the single file:

    /etc/elda/conf.d/ROOT/config.ttl

which contains the definition of 3 LDA endpoints

| URL | Description | 
|-----|-------------|
| `/anything`     | Lists any arbitrary subject in the data. LDA filter parameters can be used to be more selective. |
| `/about?resource={uri}` | Retrieve a description, if any, of a particular resource from the datasource |
| `/mentions?resource={uri}` | Retrieve items that have a property that references some specific resource - i.e. mentions it. |

Early in the configuration file you will find the lines:

            api:sparqlEndpoint  <http://environment.data.gov.uk/sparql/bwq/query>;
        #   api:sparqlEndpoint  <http://localhost:3030/store/query>;
  
which configure the SPARQL endpoint accessed by elda. Toggle the `#` comment in front of each line. Thus:  

        #   api:sparqlEndpoint  <http://environment.data.gov.uk/sparql/bwq/query>;
            api:sparqlEndpoint  <http://localhost:3030/store/query>;

You are now set up to use a local [https://jena.apache.org/documentation/serving_data/](Fueski "Apache Jena Fuseki Page")
which you can start up as follows:

    cd <fuseki-installation-directory>
    java -Xmx1024 -jar fuseki-server.jar --loc=<path-to-tdb-dataset-directory> /store
    
This assumes that you have loaded the data that you want to serve into a [http://jena.apache.org/documentation/tdb/](Jena TDB) store.
If you've not already done this, the `fuseki-server.jar` file contains a complete installation of Jena and can serve as a bit of a 
'swiss-army knife' with respect to jena command-line utilities.

    java -cp fuseki-server.jar tdb.tdbloader --loc=<path-to-tdb-dataset-directory> [rdf-files-to-load]

Other jena command-lines tooks that you might find useful are:

    java cp fuseki-server.jar tdb.tdbquery --loc=<path-to-tdb-dataset-directory> --query=<sparql-query-file>

add `--help` for command line help in most cases.

Exploring your own data
-----------------------

Back to the main plot. Having started up Fuseki on one shell, you can restart `elda-starter` in another:

    mvn tomcat6:run
    mvn tomcat7:run

or

    mvn jetty:run
    
should all work with the project out of the box. You can use the following properties to change the port number used by elda-starter:

    mvn -Dmaven.tomcat.port=80 tomcat6:run
    mvn -Djetty.port=80 jetty:run
    
Note that on some operating systems, access to ports lower than 1024 may be restricted and elda may need to be started from a priviledged account.

    mvn clean package
    sudo mvn -Dmaven.tomcat.port=80 tomcat6:run
    
This will have the effect of `mvn` creating and populating a local maven repository in `/root/.m2`. 
It can also result in some files within `.../elda-starter/target` being owned by the root user.

By now you should gave elda running on you're own data. A good place to start exploring is:

    http://localhost:8080/anything
    
This will display some 'random' items and is the LDA moral eqivalent to the common exploritory SPARQL query:

    SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10

You might also try the non-html format links to the top right of the displayed page or use 

    http://localhost:8080/anything.rdf
    http://localhost:8080/anything.ttl
    http://localhost:8080/anything.json
    http://localhost:8080/anything.xml
    http://localhost:8080/anything.csv
    http://localhost:8080/anything.html
    
Note that all of the output formatters except those for `csv` and `html` for ar  builtin. The `csv` and `html` 
formatter are derived from the `xml` format through the use of `xslt` transforms that are defined in the 
sample configuration file.

Once you have explored your data a little you might like to find all the mentions of some item in your data 

    http://localhost:8080/mentions?resource={url}

where you `{url}` is substituted with your URL of interest.

You might also like to try:

    http://localhost:8080/anything?type={class-url}
    
where `{class-url}` is substituted with an `rdf:Class` or an `owl:Class` used in your data.

Hardening your configuration
----------------------------
LDA in general and elda in particular work best when a full complement of short-names are defined for the data in the store.
Having defined short-names and property ranges for data in the store enables much more uses of the LDA framework. 
Shortname declarations use the property `api:label` to assign a short name to a URI. This shortname is subsituted for
that URI in JSON field names (in the JSON rendering) and XML element names in the XML rendering. The sample 
configuration contains the following shortname declarations.

    rdfs:label  a               rdf:Property;
                api:label       "label";
                api:structured  "true"^^xsd:boolean;
                .
            
    rdf:type    a               rdf:Property;
                rdfs:range      rdfs:Resource;
                api:label       "type";
                .
                
    geo:lat     rdfs:range      xsd:decimal;
                api:name        "lat";
                .
    geo:long    rdfs:range      xsd:decimal;
                api:name        "long";
                .
                
Notice that property ranges are also given. This is necessary so that elda can determine right kind of SPARQL
expression to construct in the case of an `&{P}={V}` filter expression being given as a URL parameter such as:

    type={class-url}
    
in one of the exploratory URI given above. The `{P}` in `{P}={V}` can actually be a chain of property shortnames
radiating out along RDF property arcs away from the item of interest `{p1}.{p2}.{p3}=V` where `{p1}`-`{p3}` are 
substituted with actual property shortnames. 

Property shortnames can also be used to enhance the view of the data being presented. Adding the following URL parameter

    &_properties={p11}.{p12}.{p13},{p2},{p3}

where `{pnn}` substitute for property shortnames attempts to 'pull' the values at the end of those chains into the 
view of the data being presented.

There are some SPARQL queries in `./sparql` that you can run on your data to bootstrap the shortname declarations in your configuration:

| SPARQL query | Description |
|--------------|-------------|
| `bootstrap-shortnames.rq` | Create an RDF file that of initial shortname and property range declarations to be inserted into an LDA configuration. Does *not* check for duplicate usage of a shortname; Does *not* check for single datatype on literal property ranges.  | 
| `duplicate-localnames.rq`| Identifies URI that will lead to duplicate shortname assignments via the query above. These will need to be resolved manually. |
| `problem-property-ranges.rq` | Identifies properties whose range either mixes objects and literals or that use multiple datatypes. These cannot be handled well in LDA `P=V` filter expressions.  | 

Use these queries on your data (eg. via the `tdb.tdbquery` utility mentioned above or via the Fuseki SPARQL 
form accessible at [http://localhost:3030](http://localhost:3030 "Fuseki UI")) to create shortname declarations 
for your LDA configuration.

Exlore your data using `/anything` together with property chain based property value filtering, i.e. `&P=V`. 

Extend the views the items you are interested in using `&_properties={p1},{p2},{p3}` where `{pn}` substitutes for 
a shortname property chain.

You should now be ready to think about creating your own application specific LDA List and Item endpoints.
