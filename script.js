document.addEventListener('DOMContentLoaded', function() {
    // بيانات التطبيقات - استرجاع من التخزين المحلي
    let apps = [];

    // استرجاع التطبيقات من التخزين المحلي إذا وجدت
    if (localStorage.getItem('apps')) {
        apps = JSON.parse(localStorage.getItem('apps'));
    }

    // عرض التطبيقات عند تحميل الصفحة
    displayApps(apps);

    // إضافة المستمعين للأحداث
    setupEventListeners();

    // دالة لعرض التطبيقات في الصفحة
    function displayApps(appsToDisplay) {
        const appsContainer = document.getElementById('apps-container');
        appsContainer.innerHTML = '';

        if (appsToDisplay.length === 0) {
            appsContainer.innerHTML = '<p class="no-apps">لا توجد تطبيقات متاحة</p>';
            return;
        }

        appsToDisplay.forEach(app => {
            const appCard = document.createElement('div');
            appCard.className = 'app-card';
            appCard.setAttribute('data-id', app.id);
            
            appCard.innerHTML = `
                <div class="app-image" style="background-image: url('${app.image}')"></div>
                <div class="app-info">
                    <h3 class="app-name">${app.name}</h3>
                    <span class="app-category">${getCategoryName(app.category)}</span>
                    <p class="app-description">${app.description}</p>
                    <a href="${app.downloadUrl}" class="download-btn" target="_blank">تحميل</a>
                </div>
            `;
            
            appsContainer.appendChild(appCard);
            
            // إضافة حدث النقر لفتح التفاصيل
            appCard.addEventListener('click', function(e) {
                // تجاهل إذا كان النقر على زر التحميل
                if (e.target.classList.contains('download-btn')) {
                    e.stopPropagation();
                    return;
                }
                openAppDetails(app);
            });
        });
    }

    // دالة لإعداد المستمعين للأحداث
    function setupEventListeners() {
        // البحث عن التطبيقات
        const searchInput = document.getElementById('search-apps');
        const searchBtn = document.getElementById('search-btn');

        searchInput.addEventListener('input', function() {
            filterApps();
        });

        searchBtn.addEventListener('click', function() {
            filterApps();
        });

        // فلترة حسب الفئات
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع الأزرار
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // إضافة الفئة النشطة للزر المضغوط
                this.classList.add('active');
                // فلترة التطبيقات
                filterApps();
            });
        });

        // إغلاق النافذة المنبثقة
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', function() {
            document.getElementById('app-modal').style.display = 'none';
        });

        // إغلاق النافذة المنبثقة عند النقر خارجها
        window.addEventListener('click', function(e) {
            const modal = document.getElementById('app-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // دالة لفلترة التطبيقات حسب البحث والفئة
    function filterApps() {
        const searchValue = document.getElementById('search-apps').value.trim().toLowerCase();
        const selectedCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        
        let filteredApps = apps;
        
        // فلترة حسب النص المبحوث عنه
        if (searchValue !== '') {
            filteredApps = filteredApps.filter(app => 
                app.name.toLowerCase().includes(searchValue) || 
                app.description.toLowerCase().includes(searchValue)
            );
        }
        
        // فلترة حسب الفئة
        if (selectedCategory !== 'all') {
            filteredApps = filteredApps.filter(app => app.category === selectedCategory);
        }
        
        // عرض التطبيقات المفلترة
        displayApps(filteredApps);
    }

    // دالة لفتح تفاصيل التطبيق
    function openAppDetails(app) {
        const modalContent = document.getElementById('modal-app-details');
        modalContent.innerHTML = `
            <div class="app-details">
                <img src="${app.image}" alt="${app.name}" class="app-details-image">
                <h2 class="app-details-name">${app.name}</h2>
                <span class="app-details-category">${getCategoryName(app.category)}</span>
                <p class="app-details-description">${app.description}</p>
                <a href="${app.downloadUrl}" class="btn app-details-download" target="_blank">تحميل التطبيق</a>
            </div>
        `;
        
        document.getElementById('app-modal').style.display = 'block';
    }

    // دالة للحصول على اسم الفئة بالعربية
    function getCategoryName(category) {
        const categories = {
            'games': 'ألعاب',
            'social': 'تواصل اجتماعي',
            'tools': 'أدوات',
            'education': 'تعليم'
        };
        
        return categories[category] || category;
    }
});
