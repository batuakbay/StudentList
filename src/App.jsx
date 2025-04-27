import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Table, message } from "antd";
import { fetchStudents, addStudent } from "./Api";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState(null); 
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm(); 
  const [loading, setLoading] = useState(true);
  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Öğrenci listesi yüklenirken hata oluştu:", error.message);
      setLoading(false);
      message.error("Öğrenci listesi yüklenirken hata oluştu.");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (loading) {
      message.loading("Öğrenciler yükleniyor...");
    } else {
      message.destroy();
    }
  }, [loading]);
  const handleSearch = (values) => {
    const filteredData = students.filter((student) =>
      student.name.toLowerCase().includes(values.name.toLowerCase())
    );
    setFilteredStudents(filteredData); 
    message.success("Filtreleme işlemi başarıyla tamamlandı!");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleAddStudent = async (values) => {
    try {
      const newStudent = await addStudent(values);
      setStudents((prevStudents) => [...prevStudents, newStudent]);
      message.success("Öğrenci başarıyla eklendi!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Öğrenci eklenirken hata oluştu.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Student's ID",
      dataIndex: "student_id",
      key: "student_id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student List</h1>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <Button type="primary" onClick={showModal}>
          + Add Student
        </Button>
        <Button
          type="primary"
          onClick={() => setFilteredStudents(null)} 
          style={{ marginLeft: "10px" }}
        >
          Clear Filter
        </Button>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginLeft: "20px" }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter a name to search!" }]}
          >
            <Input placeholder="Search by Name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        dataSource={filteredStudents || students} 
        columns={columns}
        loading={loading}
        rowKey="student_id"
      />
      <Modal
        title="Add New Student"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddStudent}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the student name!" }]}
          >
            <Input />
          </Form.Item> 
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Student
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;