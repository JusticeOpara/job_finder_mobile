import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";

import useFetch from "../../hook/useFetch";

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState();
  const { data, refetch, isLoading, error } = useFetch("job-details", {
    job_id: params.id,
  });
 
  const onRefresh = useCallback(()=>{
setRefreshing(true)
refetch()
setRefreshing(false)
  },[]);

  const displayTabContent =() =>{
    switch(activeTab){
     case 'Qualifactions':
        return <Specifics
        title ="Qualifications"
        points={data[0].job_highlights?.Qualifications ?? ['N/A']}/>

     case 'About':
        return <JobAbout
        info={data[0].job_description ?? 'No data provided'}/>

     case 'Responsibilities':
        return <Specifics
        title ="Responsibilities"
        points={data[0].job_highlights?.Responsibilities ?? ['N/A']}/>

      default:
            break
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>

      <Text>Job Details</Text>

      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension={"60%"}
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension={"60%"} />
          ),
          headerTitle: "",
        }}>

        </Stack.Screen>

      <>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>

          {isLoading ? (
            <ActivityIndicator />
          ) : error ? (

            <Text>Something went wrong</Text>

          ) : data.length === 0 ? (

            <Text>No data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>

              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
              />


              <Text>Job Tabs</Text>


              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />


             {displayTabContent()} 
            </View>
          )}

        </ScrollView>

        <JobFooter url={data[0]?.job_google_link ?? 'https://careers.google.com/jobs/results'}/>
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
