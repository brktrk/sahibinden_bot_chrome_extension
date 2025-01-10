document.getElementById('downloadData').addEventListener('click', () => {
    console.log('İndirme butonuna tıklandı.');

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // Aktif sekmeyi alıyoruz ve content.js'e mesaj gönderiyoruz
        chrome.tabs.sendMessage(tabs[0].id, { action: 'downloadData' }, (response) => {
            // Mesajdan gelen yanıtı kontrol ediyoruz
            if (response && response.success) {
                console.log('Veriler indirildi.');
            } else {
                console.error('Veriler indirilemedi.');
            }
        });
    });
});
document.getElementById('openLink').addEventListener('click', () => {
    console.log('Linkleri aç butonuna tıklandı.');

    // Aktif sekmeye mesaj gönderiyoruz
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'openLinks' });
        }
    });
});