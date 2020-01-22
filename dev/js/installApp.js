export default function () {
	let deferredPrompt, 
        btnInstall      = '#installBtn', 
        btnSkipInstall  = '#skipInstallBtn', 
        bannerInstall   = '#installBanner',
        isActive        = 'is-active';

    const hideBanner = () => {
        document.querySelector( bannerInstall ).classList.remove( isActive );
        sessionStorage.setItem('skip_Install', 1);
    }

    window.addEventListener('beforeinstallprompt', event => {
        let skipInstall = sessionStorage.getItem('skip_Install')

        // Prevent Chrome 67 and earlier from automatically showing the prompt
        event.preventDefault();

        // Stash the event so it can be triggered later.
        deferredPrompt = event;

        // Attach the install prompt to a user gesture
        document.querySelector( btnInstall ).addEventListener( 'click', event => {

            // Show the prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
            hideBanner();
        });

        document.querySelector( btnSkipInstall ).addEventListener( 'click', event => {
            hideBanner();
        });

        // Update UI notify the user they can add to home screen
        if(skipInstall !== '1') {
            document.querySelector( bannerInstall ).classList.add( isActive );
        }
    });
}