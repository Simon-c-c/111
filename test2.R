library(DBI)
library(RMySQL)
library(tidyverse)
library(DT)
library(rjson)
library(tidyjson)
library(readr)

testdf <- read_csv(file = 'data2.csv')
testdf1 <- testdf[,c(1,2,3,4,5,12,18,23,24,49)]

testdf1[order(testdf1$org_id),]

testdf2 <- testdf1 %>% 
  mutate(Var1 = case_when(get_score == 0 ~ 0,
                          get_score != 0 ~ 1))

testdf2 %>% count(Var1,sort = TRUE)

testdf3 <- testdf2 %>% 
  group_by(class_id)

testdf3 %>% count(Var1,sort = TRUE)

testdf3 <- testdf3 %>% 
  mutate(Var2 = case_when(study_dur_coding <= 100 ~ 0,
                          study_dur_coding <= 1800 ~ 1,
                          study_dur_coding > 1800 ~ 2)) %>% 
  ungroup()

testdf3 <- testdf3 %>% 
  group_by(Var2) 

testdf3 %>% 
  count(Var1,sort = TRUE)

testdf3 <- testdf3 %>% 
  mutate(code_0 = case_when(study_dur_coding < 10 ~ 1,
                            study_dur_coding > 10 ~ 0))

testdf3 <- testdf3 %>% 
  mutate(debug_0 = case_when(study_dur_debug < 10 ~ 1,
                             study_dur_debug > 10 ~ 0))

testdf3 %>% ungroup()

testdf3 %>% 
  count(code_0,sort = TRUE)

testdf3 %>% 
  count(debug_0,sort = TRUE)

testdf3 %>% 
  summarise(across(where(is.numeric), .fns= list(min = min, mean = mean)))

testdf3 %>% 
  summarise(across(where(is.numeric), .fns= list(min = min, 
                                                 mean = mean,
                                                 stdev = sd,
                                                 # q25 = ~quantile(., 0.25),
                                                 # q75 = ~quantile(., 0.75),
                                                 max = max)))
