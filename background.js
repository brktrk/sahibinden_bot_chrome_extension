// chrome.runtime.onMessage dinleyicisini burada tanımlıyoruz
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Eğer gelen mesajın action'ı 'openLink' ise
    if (message.action === 'openLink') {
        const url = message.url;

        // Yeni sekme açmak için chrome.tabs.create() kullanıyoruz
        chrome.tabs.create({ url: url }, (newTab) => {
            if (newTab) {
                console.log('Yeni sekme açıldı: ', newTab.url);

                // Sekme yüklendikten sonra 'numaraAl' butonuna tıklatmak için
                chrome.tabs.onUpdated.addListener(function tabListener(tabId, changeInfo) {
                    // Yalnızca sekme tam olarak yüklendiğinde (complete) işlem yapalım
                    if (tabId === newTab.id && changeInfo.status === 'complete') {
                        // 'numaraAl' butonuna tıklatmayı sağlamak için script çalıştırıyoruz
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            func: function() {
                                const numaraAlButton = document.getElementById('numaraAl');
                                if (numaraAlButton) {
                                    numaraAlButton.click();
                                    console.log('Numara Al butonuna tıklandı.');
                                } else {
                                    console.error('Numara Al butonu bulunamadı.');
                                }
                            }
                        }, (result) => {
                            console.log('numaraAl butonuna tıklama işlemi tamamlandı.');
                        });

                        // Sekme tamamlandığında dinleyiciyi kaldırıyoruz
                        chrome.tabs.onUpdated.removeListener(tabListener);
                    }
                });
            } else {
                console.error('Sekme açılamadı.');
            }
        });

        // Yanıt göndermek isterseniz
        sendResponse({ status: 'success', tabUrl: url });
    }

    // Eğer gelen mesajın action'ı 'downloadData' ise
    if (message.action === 'downloadData') {
        // Aktif sekmeyi bulmak için chrome.tabs.query() kullanıyoruz
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length > 0) {
                const activeTab = tabs[0];  // Aktif sekmeyi alıyoruz

                // Aktif sekmeye mesaj gönderiyoruz
                chrome.tabs.sendMessage(activeTab.id, { action: 'downloadData' }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error("Mesaj gönderilemedi:", chrome.runtime.lastError);
                    } else {
                        // Yanıt kontrolü
                        if (response && response.success) {
                            console.log('Veriler indirildi.');
                        } else {
                            console.error('Veriler indirilemedi.');
                        }
                    }
                });
            } else {
                console.error("Aktif sekme bulunamadı.");
            }
        });
    }

    // Asenkron işlem olduğu için true döndürmelisiniz
    return true;
});
