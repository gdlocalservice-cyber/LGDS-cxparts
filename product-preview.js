(() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const motors = {"cbasic": {"src": "https://embed.widencdn.net/img/cgi/nwua1abbcj/420px/B3010_1.png", "source": "https://www.chamberlain.com/p/B3010"}, "cplus": {"src": "https://embed.widencdn.net/img/cgi/cxrws10rjr/420px/B4310_1.png", "source": "https://www.chamberlain.com/p/B4310"}, "ccamera": {"src": "https://embed.widencdn.net/img/cgi/mpuefsioer/420px/B5330_1.png", "source": "https://www.chamberlain.com/1-hp-belt-drive-opener-with-battery-backup-and-myq-connectivity/p/B5330"}, "lbase": {"src": "https://embed.widencdn.net/img/cgi/ydcrtdghz6/420px/2220L_1.png", "source": "https://www.liftmaster.com/p/2220L"}, "lplus": {"src": "https://embed.widencdn.net/img/cgi/gjlfij1aco/420px/2420L_1BEN_LM_1.png", "source": "https://www.liftmaster.com/3-4-hps-chain-drive-opener-with-built-in-camera-battery-backup-and-myq-connectivity/p/2420L"}, "lcamera": {"src": "https://embed.widencdn.net/img/cgi/ga2uduteab/420px/6580L_LM1.png", "source": "https://www.liftmaster.com/liftmaster-1-hps-belt-drive-opener-with-battery-backup-and-myq-connectivity/p/6580L"}, "cwall": {"src": "https://embed.widencdn.net/img/cgi/hv8qxnrorm/420px/RJO101MC_family_hero_1.png", "source": "https://www.chamberlain.com/wall-mount-ultra-quiet-wi-fi-garage-door-opener-with-battery-backup/p/RJO101MC"}, "lwall": {"src": "https://embed.widencdn.net/img/cgi/vwh3za0nqm/420px/98022-RJO-w-accessories-1200x1200.png", "source": "https://www.liftmaster.com/premium-series-dc-battery-backup-wall-mount-wi-fi-garage-door-opener/p/98022MC"}};
  const classic = 'https://www.clopaydoor.com/classic';
  const modern = 'https://www.clopaydoor.com/modern-steel-collection';
  const doors = {
    shortSolid: {src:'https://www.clopaydoor.com/images/default-source/product-images/garage-doors/classicsteel/normal/4050-short-black.webp?sfvrsn=87a9fcc_7', caption:'Clopay Classic Steel · short panels · black · no windows', source:classic},
    shortWindows: {src:'https://www.clopaydoor.com/images/default-source/product-images/garage-doors/classicsteel/normal/classicsteel-ironorel.webp?sfvrsn=167c5ed6_5',caption:'Clopay Classic Steel · short panels · Iron Ore · plain short windows',source:classic},
    whiteWindows: {src:'https://www.clopaydoor.com/images/default-source/product-images/garage-doors/classicsteel/normal/classic-steel-long-elegant-822.webp?sfvrsn=5a55a2ba_6',caption:'Clopay Classic Steel · white · decorative windows · manufacturer style example',source:classic},
    longWindows: {src:'https://www.clopaydoor.com/images/default-source/product-images/garage-doors/classicsteel/normal/classic-steel-short-elegant-colonial-window-822.webp?sfvrsn=b41a312a_8',caption:'Clopay Classic Steel · manufacturer installation example',source:classic},
    flushSolid: {src:'https://www.clopaydoor.com/images/default-source/product-images/garage-doors/modernsteel/normal/modern-steel-solid-black-822.webp?sfvrsn=4db4a080_4',caption:'Clopay Modern Steel · flush panels · black · no windows',source:modern},
    flushWindows: {src:'https://www.clopaydoor.com/images/default-source/product-images/garage-doors/modernsteel/normal/modern-steel-denver822.webp?sfvrsn=e8a87e6b_6',caption:'Clopay Modern Steel · flush panels · black · plain long windows',source:modern}
  };
  window.renderProductPreview = (category,groups,selections) => {
    const host=document.getElementById('productPreview');if(!host)return;
    if(!['doors','openers'].includes(category)){host.hidden=true;return;}host.hidden=false;
    const pick=key=>{const index=selections[key];return index==null?null:groups.find(g=>g.key===key)?.options[index];};
    let item=null,title='',details='',note='';
    if(category==='openers') {
      const option=pick('brand');title='Your opener';details=option?.label||'';
      if(option?.previewKey && motors[option.previewKey]) {item=motors[option.previewKey];item={...item,caption:option.label};}
      note='Manufacturer product photo. Included accessories are confirmed in your quote.';
    } else {
      title='Clopay installation photos';
      const shape=pick('shape'), windows=pick('windows'), color=pick('color');
      const withWindows=windows && !/no windows/i.test(windows.label);
      if(shape) {
        if(/flush/i.test(shape.label))item=withWindows?doors.flushWindows:doors.flushSolid;
        else if(/long/i.test(shape.label))item=doors.longWindows;
        else item=withWindows?doors.shortWindows:doors.shortSolid;
      }
      details=['size','shape','color','windows','insulation'].map(k=>pick(k)?.label).filter(Boolean).join(' · ');
      note='Original Clopay photograph, shown as a style example. The photographed color, windows and dimensions may differ from your selection.';
    }
    const visual=item?`<img class="opener-photo" style="height:${category==='doors'?'300':'240'}px" src="${esc(item.src)}" alt="${esc(item.caption)}" referrerpolicy="no-referrer" />`:'<div class="preview-empty">Select '+(category==='doors'?'a panel style':'an opener')+' to view the manufacturer photo.</div>';
    host.innerHTML=`<div class="preview-heading"><span>${title}</span><button id="expandPreview" type="button" ${item?'':'disabled'}>⤢ Enlarge</button></div><div class="preview-art">${visual}</div><div class="preview-details">${esc(details)}</div>${item?`<p class="preview-note"><strong>Photo:</strong> ${esc(item.caption)}</p>`:''}<p class="preview-note">${note}</p>${item?`<p class="preview-note"><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">View manufacturer product</a>${category==='doors'?' · <a href="https://ezdoor.clopay.com/" target="_blank" rel="noopener noreferrer">Customize on Clopay</a>':''}</p>`:''}`;
    const img=host.querySelector('img');if(img)img.onerror=()=>img.replaceWith(Object.assign(document.createElement('p'),{className:'preview-empty',textContent:'Photo unavailable. View the manufacturer link below.'}));
    document.getElementById('expandPreview').onclick=()=>{
      if(!item)return;let dialog=document.getElementById('previewDialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='previewDialog';dialog.className='preview-dialog';dialog.setAttribute('aria-label','Manufacturer product photo');document.body.appendChild(dialog);}
      dialog.innerHTML=`<button type="button" aria-label="Close photo">×</button>${visual}<p>${esc(item.caption)}</p><p>${note}</p>`;dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close();};dialog.showModal();
    };
  };
})();
