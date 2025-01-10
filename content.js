chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openLinks') {
        const links = document.querySelectorAll('a');
        const openedLinks = new Set(); // openedLinks'i burada tanımlıyorsunuz, her seferinde sıfırlanır
        const linksToOpen = [];

        // Sayfadaki "ilan" içeren linkleri toplama
        links.forEach(link => {
            const href = link.href;

            // Eğer link "ilan" içeriyorsa ve daha önce açılmamışsa
            if (href.includes('/ilan/') && !openedLinks.has(href)) {
                openedLinks.add(href);
                linksToOpen.push(href); // Toplanan linkleri ekliyoruz
            }
        });

        // 3 saniyede bir yeni sekme açma işlemi başlatma
        let index = 0;
        const intervalId = setInterval(() => {
            if (index < linksToOpen.length) {
                const href = linksToOpen[index];
                chrome.runtime.sendMessage({ action: 'openLink', url: href });
                console.log('Yeni sekme açılıyor: ', href);
                index++;
            } else {
                // Eğer tüm linkler açıldıysa interval'i durduruyoruz
                clearInterval(intervalId);
            }
        }, 15000); // 3000 ms = 3 saniye
    }
if (message.action === 'downloadData') {
        console.log('Mesaj alındı ve işlem başlatılacak...');
        
        // Kullanıcı verilerini chrome.storage.local'dan alıyoruz
        chrome.storage.local.get(['usersData'], function(result) {
            let usersData = result.usersData || [];

            if (usersData.length === 0) {
                console.error('Henüz veri eklenmedi.');
                sendResponse({ success: false });
                return;
            }

            // CSV içeriği oluşturuluyor
            let csvContent = 'Username,PhoneNumber\n';  // CSV başlıkları
            usersData.forEach(user => {
                csvContent += `${user.username},${user.phoneNumber}\n`;
            });

            // CSV'yi indirilebilir hale getirme
            let blob = new Blob([csvContent], { type: 'text/csv' });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'users_data.csv';
            link.click();

            // İndirme işlemi tamamlandığında chrome.storage.local'ı temizle
            chrome.storage.local.remove('usersData', function() {
                console.log('Veriler indirildikten sonra chrome.storage.local temizlendi.');
            });

            // İndirme başarılıysa true, değilse false gönder
            sendResponse({ success: true });
        });
        
        // Asenkron işlem nedeniyle return true ile geri yanıt bekliyoruz
        return true;
    }
});
const classifiedDetailTitle = document.querySelector('.classifiedDetailTitle');
let isProcessing = false;  // İşlem durumu bayrağı

if (classifiedDetailTitle) {
    const numaraAlMenuItem = document.createElement('li');
    numaraAlMenuItem.innerHTML = '<a rel="nofollow" class="classifiedPrint" id="numaraAl"><span class="icon"></span> Numara Al</a>';

    const classifiedEventsList = classifiedDetailTitle.querySelector('.classifiedEvents');
    if (classifiedEventsList) {
        classifiedEventsList.appendChild(numaraAlMenuItem);
    }

    const numaraAlButton = document.getElementById('numaraAl');

    if (numaraAlButton) {
        numaraAlButton.addEventListener('click', (e) => {
            // Eğer işlem zaten yapılıyorsa, işlem başlatma
            if (isProcessing) {
                console.log('Numara alma işlemi zaten devam ediyor.');
                return;
            }

            // İşlem başlatılıyor
            isProcessing = true;
            numaraAlButton.textContent = "Numara Alındı";  // Buton metnini değiştir
            numaraAlButton.disabled = true;  // Butonu devre dışı bırak

            // Verileri saklamak ve chrome.storage.local'a eklemek
            fetchAndStoreUserData();
        });
    }

    function fetchAndStoreUserData() {
        try {
            let classifiedContainer = document.querySelector('.classifiedUserContent') || document.querySelector('.classifiedOtherBoxesContainer');

            if (classifiedContainer) {
                let phoneNumber = '';
                let username = '';

                // Telefon numarasını alma işlemi
                let phoneGroups = classifiedContainer.querySelectorAll('.user-info-phones .dl-group');
                phoneGroups.forEach(group => {
                    let label = group.querySelector('dt');
                    if (label && label.textContent.includes('Cep')) {
                        let phoneElement = group.querySelector('dd');
                        if (phoneElement) {
                            phoneNumber = phoneElement.textContent.replace(/[^\d]/g, '');
                            phoneNumber = '+9' + phoneNumber;  // Türkiye numarası için +9 ekliyoruz
                        }
                    }
                });

                if (!phoneNumber) {
                    // .userContactInfo içinden telefon numarasını alma
                    let phoneElement = classifiedContainer.querySelector('.userContactInfo .pretty-phone-part span');
                    if (phoneElement) {
                        phoneNumber = '+9' + phoneElement.getAttribute('data-content').replace(/[^\d+]/g, '');
                    } else {
                        let phoneNumberElement = classifiedContainer.querySelector('.userContactInfo .mobile + .pretty-phone-part');
                        if (phoneNumberElement) {
                            phoneNumber = '+9' + phoneNumberElement.textContent.replace(/[^\d]/g, '');
                        } else {
                            let alternativePhone = document.querySelector('.user-info-phones dd');
                            if (alternativePhone) {
                                phoneNumber = '+9' + alternativePhone.textContent.replace(/[^\d]/g, '');
                            }
                        }
                    }
                }

                // Kullanıcı adını alma işlemi
                let usernameContent = classifiedContainer.querySelector('.username-info-area style');
                if (usernameContent) {
                    let match = usernameContent.textContent.match(/content:\s*'(.*?)'/);
                    username = match && match[1] ? match[1].split(' ')[0] : '';
                } else {
                    let alternativeUsername = classifiedContainer.querySelector('.username-info-area h5');
                    if (alternativeUsername) {
                        username = alternativeUsername.textContent.trim();
                    } else {
                        let parisNameSpan = classifiedContainer.querySelector('.paris-name-area .paris-name span');
                        if (parisNameSpan) {
                            username = parisNameSpan.textContent.trim();
                        } else {
                            let fallbackUsername = document.querySelector('.user-info-agent h3');
                            if (fallbackUsername) {
                                username = fallbackUsername.textContent.trim();
                            }
                        }
                    }
                }

                // İsimdeki ilk boşluğa kadar almak
                username = username.split(' ')[0];  // Sadece ilk kelimeyi alıyoruz

                // Veriyi chrome.storage.local'a kaydediyoruz
                chrome.storage.local.get(['usersData'], function(result) {
                    let existingData = result.usersData || [];

                    existingData.push({
                        username: username,
                        phoneNumber: phoneNumber
                    });

                    chrome.storage.local.set({ 'usersData': existingData }, function() {
                        console.log('Kullanıcı verisi eklendi:', username, phoneNumber);
                    });
                });

            } else {
                console.error('classifiedUserContent ve classifiedOtherBoxesContainer bulunamadı.');
            }

        } catch (error) {
            console.error('Hata oluştu:', error);
        }
    }
}
