// 1. Khởi tạo mảng 5 công việc mẫu từ Object
let tasks = [
    { id: 1, name: "Làm bài đề cương ptvp", date: "2026-12-01", priority: "Cao", completed: true },
    { id: 2, name: "bla bla", date: "2026-12-02", priority: "Cao", completed: false },
    { id: 3, name: "Kiểm tra ", date: "2026-12-02", priority: "Trung bình", completed: false },
    { id: 4, name: "Nộp bài lên Host", date: "2026-12-05", priority: "Cao", completed: false },
    { id: 5, name: "Đọc tài liệu", date: "2026-12-10", priority: "Thấp", completed: true }
];

// 2. Trỏ tới các DOM Elements
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskDateInput = document.getElementById('task-date');
const taskPriorityInput = document.getElementById('task-priority');
const errorMsg = document.getElementById('error-msg');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');

// 3. Hàm render danh sách ra UI (kết hợp lọc và tìm kiếm)
function renderTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterStatus.value;

    taskList.innerHTML = ''; // Xóa rỗng trước khi render lại

    // Lọc mảng dựa trên từ khóa tìm kiếm và trạng thái
    const filteredTasks = tasks.filter(task => {
        const matchName = task.name.toLowerCase().includes(searchTerm);
        const matchStatus = filterValue === 'all' ? true : 
                           (filterValue === 'complete' ? task.completed : !task.completed);
        return matchName && matchStatus;
    });

    // In ra giao diện
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        // Phân loại class màu sắc cho mức ưu tiên
        let priorityClass = '';
        if (task.priority === 'Cao') priorityClass = 'priority-high';
        else if (task.priority === 'Trung bình') priorityClass = 'priority-medium';
        else if (task.priority === 'Thấp') priorityClass = 'priority-low';

        // --- BỔ SUNG: Xử lý định dạng ngày tháng sang DD/MM/YYYY ---
        let formattedDate = 'Không có';
        if (task.date) {
            // task.date mặc định là "YYYY-MM-DD". Ta sẽ cắt chuỗi và đảo ngược lại.
            const [year, month, day] = task.date.split('-');
            formattedDate = `${day}/${month}/${year}`;
        }

        li.innerHTML = `
            <div class="task-info">
                <strong>${task.name}</strong><br>
                <div class="task-meta">
                    <small>Hạn: ${formattedDate}</small>
                    <span class="badge ${priorityClass}">${task.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-toggle" onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Hoàn tác' : 'Xong'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Xóa</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// 4. Xử lý Thêm công việc
taskForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn load lại trang
    const name = taskNameInput.value.trim();

    // Kiểm tra tên trống
    if (name === '') {
        errorMsg.classList.replace('error-hidden', 'error-visible');
        return;
    }
    errorMsg.classList.replace('error-visible', 'error-hidden');

    // Thêm vào mảng
    const newTask = {
        id: Date.now(), // Tạo ID duy nhất bằng timestamp
        name: name,
        date: taskDateInput.value,
        priority: taskPriorityInput.value,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();
    taskForm.reset(); // Xóa form
});

// 5. Hàm Đánh dấu hoàn thành
function toggleTask(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        renderTasks();
    }
}

// 6. Hàm Xóa công việc
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

// 7. Bắt sự kiện Tìm kiếm & Lọc
searchInput.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);

// Khởi chạy render lần đầu khi mở trang
renderTasks();