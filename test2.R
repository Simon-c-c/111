library(DBI)
library(RMySQL)
library(tidyverse)
library(DT)
library(rjson)
library(tidyjson)
library(readr)

testdf <- read_csv(file = 'data2.csv')
testdf1 <- testdf[,c(1,2,3,4,5,12,49)]

testdf1[order(testdf1$org_id),]