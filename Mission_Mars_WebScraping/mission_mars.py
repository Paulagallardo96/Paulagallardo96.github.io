#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Nov 28 23:35:37 2018

@author: paulaamandagallardo
"""

# Dependencies
from splinter import Browser
import requests
import pandas as pd
from bs4 import BeautifulSoup as bs
import time 


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "./chromedriver"}
    return Browser("chrome", **executable_path, headless=False)


def scrape():
    browser = init_browser()
    
    return_dict = {}
    
    # Initialize PyMongo to work with MongoDBs
    #conn = 'mongodb://localhost:27017'
    #client = pymongo.MongoClient(conn)
    
    #specify the url
    nasa = "https://mars.nasa.gov/news/"
    MarsImages = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    MarsWeatherTweet = "https://twitter.com/marswxreport?lang=en"
    MarsFacts = "https://space-facts.com/mars/"
    MarsHemispheres = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    
    ### Nasa Mars News
    
    # Retrieve page with the requests module
    response = requests.get(nasa)
    
    # Create BeautifulSoup object; parse with 'html.parser'
    soup = bs(response.text, 'lxml')
    
    # results are returned as an iterable list
    results = soup.find_all('div', class_="slide")
    
    # Loop through returned results
    for result in results:
        # Error handling
        try:
            # Identify and return title of listing
            news_title = result.find('div', class_="content_title").a.text
            # Identify and return price of listing
            news_p = result.find('div', class_="rollover_description_inner").text
            
    
            # Print results only if title, price, and link are available
            if (news_title and news_p):
                print('-------------')
                print(news_title)
                print(news_p)
        except AttributeError as e:
            print(e)
    
    mars_news_dict = {"news_title": news_title, "news_p" : news_p}
    
    return_dict.update(mars_news_dict)
            
    ### JPL Mars Space Images
        #https://splinter.readthedocs.io/en/latest/drivers/chrome.html
      
    
    #executable_path = {'executable_path': './chromedriver'}
    #browser = Browser('chrome', **executable_path, headless=False)
    
    browser.visit(MarsImages)
    
    browser.find_by_id('full_image').first.click()
    
    time.sleep(3)
    browser.click_link_by_partial_text('more info')
    
    html = browser.html
    soup2 = bs(html, 'html.parser')
    lede = soup2.find('figure', class_='lede')
    #print(lede)
    link = lede.a['href']
    featured_image_url='https://www.jpl.nasa.gov/' + link
    featured_image_url
    
    featured_image_dict = {"featured_image_url": featured_image_url}
    
    return_dict.update(featured_image_dict)
    
    
    ### Mars Weather (twitter)
    
    # Retrieve page with the requests module
    response = requests.get(MarsWeatherTweet)
    
    # Create BeautifulSoup object; parse with 'html.parser'
    soup = bs(response.text, 'lxml')
    
    mars_weather = soup.find('p', class_="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text").text
    mars_weather
    
    mars_weather_dict = {"mars_weather": mars_weather}
    
    return_dict.update(mars_weather_dict)
    
    ### Mars Facts
    
    # Retrieve page with the requests module
    response = requests.get(MarsFacts)
    
    # Create BeautifulSoup object; parse with 'html.parser'
    soup = bs(response.text, 'lxml')
    
    tables = pd.read_html(MarsFacts)
    tables
    
    df = tables[0]
    df.columns = [0, 1]
    df2 = df.rename(columns={0: 'Description', 1: 'Value'})
    df2
            
    html_table = df2.to_html()
    html_table
    
    html_table.replace('\n', '')
    
    df2.to_html('table.html')
    
    html_table_dict = {"html_table": html_table}
    
    return_dict.update(html_table_dict)
    
    ### Mars Hemispheres
    response = requests.get('https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars')
    soup = bs(response.text, 'lxml')
    
    
    browser.visit(MarsHemispheres)
    
    results = soup.find_all('a', class_='itemLink product-item')
    listing = []
    img_url= []
    html = browser.html
    soup = bs(html, 'html.parser')

    
    for result in results:  
    
        title = result.find('h3').text
        link = result['href']
        listing.append(title)
        print(title)
         
    #executable_path = {'executable_path': './chromedriver'}
    #Browser = Browser('chrome', **executable_path, headless=False)
    #browser.visit(MarsHemispheres)
    
    for i in range(len(results)):
        try:
            browser.click_link_by_partial_text(listing[i])
        except:
            browser.find_link_by_text('2').first.click()
            browser.click_link_by_partial_text(listing[i])
        
        html = browser.html
        soup = bs(html, 'html.parser')
        
        lede = soup.find('div', class_='downloads')
        img_url_mars = lede.a['href']
        print(img_url_mars)
        
        #dictionary 
        mars_dict1 = {"title": listing[i], "img_url": img_url_mars}
        img_url.append(mars_dict1)
        

    img_url_mars_dict = {"mars_dict1": img_url} 
    
    return_dict.update(img_url_mars_dict)

    return return_dict
        






