(() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const motors = {"cbasic": {"src": "https://embed.widencdn.net/img/cgi/nwua1abbcj/420px/B3010_1.png", "source": "https://www.chamberlain.com/p/B3010"}, "cplus": {"src": "https://embed.widencdn.net/img/cgi/cxrws10rjr/420px/B4310_1.png", "source": "https://www.chamberlain.com/p/B4310"}, "ccamera": {"src": "https://embed.widencdn.net/img/cgi/mpuefsioer/420px/B5330_1.png", "source": "https://www.chamberlain.com/1-hp-belt-drive-opener-with-battery-backup-and-myq-connectivity/p/B5330"}, "lbase": {"src": "https://embed.widencdn.net/img/cgi/ydcrtdghz6/420px/2220L_1.png", "source": "https://www.liftmaster.com/p/2220L"}, "lplus": {"src": "https://embed.widencdn.net/img/cgi/gjlfij1aco/420px/2420L_1BEN_LM_1.png", "source": "https://www.liftmaster.com/3-4-hps-chain-drive-opener-with-built-in-camera-battery-backup-and-myq-connectivity/p/2420L"}, "lcamera": {"src": "https://embed.widencdn.net/img/cgi/ga2uduteab/420px/6580L_LM1.png", "source": "https://www.liftmaster.com/liftmaster-1-hps-belt-drive-opener-with-battery-backup-and-myq-connectivity/p/6580L"}, "cwall": {"src": "https://embed.widencdn.net/img/cgi/hv8qxnrorm/420px/RJO101MC_family_hero_1.png", "source": "https://www.chamberlain.com/wall-mount-ultra-quiet-wi-fi-garage-door-opener-with-battery-backup/p/RJO101MC"}, "lwall": {"src": "https://embed.widencdn.net/img/cgi/vwh3za0nqm/420px/98022-RJO-w-accessories-1200x1200.png", "source": "https://www.liftmaster.com/premium-series-dc-battery-backup-wall-mount-wi-fi-garage-door-opener/p/98022MC"}};
  window.renderProductPreview = (category,groups,selections) => {
    const host=document.getElementById('productPreview');if(!host)return;
    if(!['doors','openers'].includes(category)){host.hidden=true;return;}host.hidden=false;
    const pick=key=>{const index=selections[key];return index==null?null:groups.find(g=>g.key===key)?.options[index];};
    let item=null,title='',details='',note='',custom=false,scale=null;
    if(category==='openers') {
      const option=pick('brand');title='Your opener';details=option?.label||'';
      if(option?.previewKey && motors[option.previewKey]) {item=motors[option.previewKey];item={...item,caption:option.label};}
      note='Manufacturer product photo. Included accessories are confirmed in your quote.';
    } else {
      title='Your door';
      const size=pick('size'),shape=pick('shape'),windows=pick('windows'),color=pick('color');
      scale=size?(parseFloat(size.label)>=16?'double':'single'):null;
      const panel=shape?({'short panel':'short','long panel':'long'}[shape.label.trim().toLowerCase()]||null):'short';
      const glass=windows?(/no windows/i.test(windows.label)?'none':panel):'none';
      const finish=color?.label.trim().toLowerCase()||'white';
      const colorKey=finish==='woodgrain'?'wood':finish;
      const standardSize=/^(8x6\.3|8x6\.6|8x6\.9|8x7|8x8|9x7|9x8|10x7|10x8|16x7|16x8|18x7|18x8)$/i.test(size?.label.trim()||'');
      const key=[scale,panel,colorKey,glass].join('-');
      let src=window.LGDS_DOOR_PHOTOS?.[key];
      custom=!!size&&(!standardSize||!src);
      if(custom)src=window.LGDS_DOOR_PHOTOS?.[`${scale}-short-white-none`];
      details=['size','shape','color','windows'].map(k=>pick(k)?.label).filter(Boolean).join(' · ');
      if(size&&src)item={src,caption:custom?`Custom made · ${scale==='double'?'16×7':'8×7'} base reference`:`Clopay · ${scale==='double'?'16×7':'8×7'} display · ${shape?.label||'Short panel'} · ${color?.label||'White'} · ${windows?.label||'No windows'}`,source:'https://www.clopaydoor.com/ezdoor'};
      note=!size?'Select a door size to start your preview.':custom?'Custom-made selection. The base door is shown as a reference; the final design will differ.':'Clopay design preview · Single shown as 8×7; double as 16×7.';
    }
    let visual=item?`<img class="opener-photo" style="${category==='doors'?'height:auto':'height:240px'}" src="${esc(item.src)}" alt="${esc(item.caption)}" referrerpolicy="no-referrer" />`:'<div class="preview-empty">'+(category==='doors'?esc(note):'Select an opener to view the manufacturer photo.')+'</div>';
    if(item&&category==='doors')visual=`<div class="door-preview-frame" style="--door-width:${scale==='double'?'690':'343'}px">${visual}${custom?'<span class="door-custom-watermark">CUSTOM MADE</span>':''}</div>`;
    host.innerHTML=`<div class="preview-heading"><span>${title}</span><button id="expandPreview" type="button" ${item?'':'disabled'}>⤢ Enlarge</button></div><div class="preview-art">${visual}</div><div class="preview-details">${esc(details)}</div>${item?`<p class="preview-note"><strong>Photo:</strong> ${esc(item.caption)}</p>`:''}<p class="preview-note">${note}</p>${item?`<p class="preview-note"><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">View manufacturer product</a>${category==='doors'?' · <a href="https://ezdoor.clopay.com/" target="_blank" rel="noopener noreferrer">Customize on Clopay</a>':''}</p>`:''}`;
    const img=host.querySelector('img');if(img)img.onerror=()=>img.replaceWith(Object.assign(document.createElement('p'),{className:'preview-empty',textContent:'Photo unavailable. View the manufacturer link below.'}));
    document.getElementById('expandPreview').onclick=()=>{
      if(!item)return;let dialog=document.getElementById('previewDialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='previewDialog';dialog.className='preview-dialog';dialog.setAttribute('aria-label','Manufacturer product photo');document.body.appendChild(dialog);}
      dialog.innerHTML=`<button type="button" aria-label="Close photo">×</button>${visual}<p>${esc(item.caption)}</p><p>${note}</p>`;dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close();};dialog.showModal();
    };
  };
})();
