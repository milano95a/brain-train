var n_imu=0,n_lb=0,n_sky=0,n_hero=0,n_wa=0,n_ciu=0,n_siteskin=0,n_button=0,n_qmp=0,n_m_lb=0,n_m_imu=0,n_m_hero=0,n_m_wa=0,n_st=0;function refreshDFPTags(){googletag.pubads().refresh();}function hideQSDiv(e){if(document.getElementById){document.getElementById(e).style.visibility="hidden";document.getElementById(e).innerHTML="";}}function gDFPC(e){var n=e+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i].replace(/^\s+|\s+$/g,'');if(c.indexOf(n)==0) return c.substring(n.length,c.length);}return "";}var mbw=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;var myWTDLK=gDFPC('WMUUID');var mlWTFP="";var myWTtemp=gDFPC('WT_FPC').split(":");for(var i=0;i<myWTtemp.length;i++){if(myWTtemp[i].search("id=")==0){mlWTFP=myWTtemp[i].slice(3);}}