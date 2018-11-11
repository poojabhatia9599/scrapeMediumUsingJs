# scrapeMediumUsingJs

1. The main function is mainlink() which starts with loading the main URL i.e http://medium.com and initializes five concurrent processes.
2. An array is maintained i.e links in which all the URLs are stored.
3. Each process takes every single URL as an input and finds the internal links associated with that URL and pops that link from the array  and appends all the new URLs to an array(i.e links).
4. After execution of any single process, the process calls itself with a new url from the links array. So at a time only 5 concurrent processes are running.
5. As soon as the programs takes a new url from the links array it appends it to a file.
6. Finally all the links are found separated by comma in the new txt file.
