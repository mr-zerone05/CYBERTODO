import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery, filter]); // Add filter as dependency since it affects the tasks display

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  // logic
  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (dateQuery && dateQuery !== 'all') {
        params.append('date', dateQuery);
      }
      
      const res = await api.get(`/tasks?${params.toString()}`);
      let tasks = [];
      
      if (Array.isArray(res.data)) {
        tasks = res.data;
      } else if (res.data && Array.isArray(res.data.tasks)) {
        tasks = res.data.tasks;
      }

      setTaskBuffer(tasks);

      // Luôn tính toán lại số lượng để đảm bảo chính xác
      const activeCount = tasks.filter(task => task.status === 'active').length;
      const completeCount = tasks.filter(task => task.status === 'complete').length;
      
      setActiveTaskCount(activeCount);
      setCompleteTaskCount(completeCount);
      
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks:", error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Lỗi xảy ra khi truy xuất tasks"
      );
      setTaskBuffer([]);
      setActiveTaskCount(0);
      setCompleteTaskCount(0);
    }
  };

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // biến
  const filteredTasks = React.useMemo(() => {
    if (!Array.isArray(taskBuffer)) return [];
    
    return taskBuffer.filter((task) => {
      if (!task) return false;
      switch (filter) {
        case 'active':
          return task.status === 'active';
        case 'completed':
          return task.status === 'complete';
        case 'all':
        default:
          return true;
      }
    });
  }, [taskBuffer, filter]);

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  useEffect(() => {
    if (visibleTasks.length === 0 && page > 1) {
      handlePrev();
    }
  }, [visibleTasks.length, page]);

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  return (
    <div className="min-h-screen w-full bg-[#020202] relative">
      {/* Custom Green Theme Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#020202',
          backgroundImage: `
            radial-gradient(circle at 20% 20%, #04471C 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, #0D2818 0%, transparent 40%)
          `
        }}
      />
      {/* Your Content/Components */}
      <div className="container relative z-10 pt-8 mx-auto text-white">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6 bg-[#0D2818] rounded-lg border border-[#0A9548]/30 shadow-lg">
          {/* Đầu Trang */}
          <Header />

          {/* Tạo Nhiệm Vụ */}
          <AddTask handleNewTaskAdded={handleTaskChanged} />

          {/* Thống Kê và Bộ lọc */}
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />

          {/* Danh Sách Nhiệm Vụ */}
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          {/* Phân Trang và Lọc Theo Date */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter
              dateQuery={dateQuery}
              setDateQuery={setDateQuery}
            />
          </div>

          {/* Chân Trang */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;