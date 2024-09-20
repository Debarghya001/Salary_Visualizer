import React, { useCallback, useEffect, useState } from 'react';
import salaries from '../CSV/salaries.csv';
import axios from 'axios';
import papa from 'papaparse';
import { Table, Button } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'antd/dist/reset.css';
import './Home.css'; 

const Home = () => {
  const [salarydata, setSalarydata] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [jobTitleData, setJobTitleData] = useState([]);
  const [showGraph, setShowGraph] = useState(false); 
  const fetchdata = useCallback(async () => {
    try {
      const response = await axios.get(salaries);
      const parsecsvdata = response.data;

      papa.parse(parsecsvdata, {
        header: true,
        complete: function (result) {
          const filteredData = result.data.filter(row => row.work_year);
          setSalarydata(filteredData);
        }
      });
    } catch (error) {
      console.log(`Error parsing data: ${error}`);
    }
  }, []);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  const avgsalary = () => {
    const groupdata = {};

    salarydata.forEach(row => {
      const year = row.work_year;
      const salary = parseFloat(row.salary);

      if (!groupdata[year]) {
        groupdata[year] = { totalsalary: 0, jobcount: 0 };
      }
      groupdata[year].totalsalary += salary;
      groupdata[year].jobcount += 1;
    });

    return Object.keys(groupdata).map(year => ({
      year,
      avgSalary: (groupdata[year].totalsalary / groupdata[year].jobcount).toFixed(2),
      totalJobcount: groupdata[year].jobcount,
    }));
  };

  const handleRowClick = (record) => {
    const filteredData = salarydata.filter(row => row.work_year === record.year);
    const jobTitleCounts = {};

    filteredData.forEach(row => {
      const jobTitle = row.job_title;
      if (!jobTitleCounts[jobTitle]) {
        jobTitleCounts[jobTitle] = 0;
      }
      jobTitleCounts[jobTitle] += 1;
    });

    const jobTitleData = Object.keys(jobTitleCounts).map(title => ({
      jobTitle: title,
      count: jobTitleCounts[title],
    }));

    setSelectedYear(record.year);
    setJobTitleData(jobTitleData);
  };

  const columns = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'No of Total Jobs',
      dataIndex: 'totalJobcount',
      key: 'totalJobcount',
      sorter: (a, b) => a.totalJobcount - b.totalJobcount,
    },
    {
      title: 'Average salary in USD($)',
      dataIndex: 'avgSalary',
      key: 'avgSalary',
      sorter: (a, b) => a.avgSalary - b.avgSalary,
    },
  ];

  const jobTitleColumns = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: 'Number of Jobs',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
    },
  ];

  const salaryGraphData = avgsalary();

  return (
    <div className="home-container">
      <h1>Salary Dashboard</h1>


      <Button className="glow-button" onClick={() => setShowGraph(!showGraph)}>
        {showGraph ? 'Show Table' : 'Show Graph'}
      </Button>

    
      {showGraph ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salaryGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgSalary" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Table
          dataSource={salaryGraphData}
          columns={columns}
          rowKey="year"
          pagination={{ pageSize: 5 }}
          bordered
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      )}

     
      {selectedYear && !showGraph && (
        <>
          <h2>Job Titles for {selectedYear}</h2>
          <Table
            dataSource={jobTitleData}
            columns={jobTitleColumns}
            rowKey="jobTitle"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </>
      )}
    </div>
  );
};

export default Home;
