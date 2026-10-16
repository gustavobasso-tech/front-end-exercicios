/* =========================================================
   Aura Cerâmica — script.js
   JavaScript puro (sem bibliotecas). Cada bloco cuida de uma parte da página.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Ajudantes ---------- */
  const $ = (seletor, base = document) => base.querySelector(seletor);
  const $$ = (seletor, base = document) => Array.from(base.querySelectorAll(seletor));
  const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // localStorage pode falhar (aba privada, por exemplo), então sempre dentro de try/catch
  const guardar = (chave, valor) => { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* ignora */ } };
  const ler = (chave, padrao) => {
    try { const v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; }
  };

  /* ---------- Dados ---------- */
  const NUMERO_WHATSAPP = '5511999999999'; // troque pelo número real do ateliê (DDI + DDD + número)

  const CATEGORIAS = { vasos: 'Vasos', xicaras: 'Xícaras', mesa: 'Mesa posta' };

  const ESMALTES = {
    terracota: { nome: 'Terracota', principal: '#B86B53', detalhe: '#F9F6F0', cor: '#B86B53' },
    musgo:     { nome: 'Verde musgo', principal: '#2C3E35', detalhe: '#D9C9B0', cor: '#2C3E35' },
    areia:     { nome: 'Areia', principal: '#D9C9B0', detalhe: '#B86B53', cor: '#D9C9B0' }
  };

  const PRODUTOS = [
    { id: 1, nome: 'Vaso Raiz',        cat: 'vasos',   tipo: 'vaso',    preco: 120, esmalte: 'terracota', fundo: '#F1E0D6',
      resumo: 'Forma orgânica com esmalte fosco, ótimo para folhagens.',
      detalhe: 'Torneado à mão, com furo de drenagem escondido na base. Ótimo para plantas de médio porte ou para flores secas.',
      medidas: '22 cm de altura · 16 cm de diâmetro' },
    { id: 2, nome: 'Vaso Brisa',       cat: 'vasos',   tipo: 'garrafa', preco: 148, esmalte: 'musgo',     fundo: '#DEE7E1',
      resumo: 'Gargalo fino e corpo arredondado, para um galho só.',
      detalhe: 'Peça alta e elegante, perfeita para um ramo solto ou para ficar sozinha sobre o aparador.',
      medidas: '30 cm de altura · 14 cm de diâmetro' },
    { id: 3, nome: 'Caneca Manhã',     cat: 'xicaras', tipo: 'xicara',  preco: 68,  esmalte: 'areia',     fundo: '#F2EAD9',
      resumo: 'Cabe 300 ml de café e um bom dia de conversa.',
      detalhe: 'Alça larga e confortável, esmalte brilhante por dentro. Pode ir ao micro-ondas.',
      medidas: '300 ml · 9 cm de altura' },
    { id: 4, nome: 'Xícara Alvorada',  cat: 'xicaras', tipo: 'xicara',  preco: 82,  esmalte: 'terracota', fundo: '#F1E0D6',
      resumo: 'Xícara de espresso com pires combinando.',
      detalhe: 'Parede fina e acabamento delicado. Vendida em par, com dois pires.',
      medidas: '90 ml · pires de 12 cm' },
    { id: 5, nome: 'Prato Sol',        cat: 'mesa',    tipo: 'prato',   preco: 95,  esmalte: 'areia',     fundo: '#F2EAD9',
      resumo: 'Prato raso com borda levemente ondulada.',
      detalhe: 'Cada prato tem uma borda um pouco diferente, porque é modelado à mão. Resistente ao uso diário.',
      medidas: '26 cm de diâmetro' },
    { id: 6, nome: 'Tigela Musgo',     cat: 'mesa',    tipo: 'tigela',  preco: 110, esmalte: 'musgo',     fundo: '#DEE7E1',
      resumo: 'Funda e acolhedora, ótima para sopas e saladas.',
      detalhe: 'Base firme e boa pegada. O esmalte escorre um pouco na borda e cria um desenho único em cada peça.',
      medidas: '16 cm de diâmetro · 600 ml' },
    { id: 7, nome: 'Jarra Orvalho',    cat: 'mesa',    tipo: 'jarra',   preco: 185, esmalte: 'terracota', fundo: '#F1E0D6',
      resumo: 'Jarra para água, suco ou flores do dia.',
      detalhe: 'Bico dosador que não pinga e alça larga. Cabe 1,2 litro.',
      medidas: '1,2 L · 21 cm de altura' },
    { id: 8, nome: 'Vaso Duna',        cat: 'vasos',   tipo: 'vaso',    preco: 135, esmalte: 'areia',     fundo: '#F2EAD9',
      resumo: 'Tom de areia com detalhes terracota.',
      detalhe: 'Textura suave que lembra dunas ao fim da tarde. Combina com ambientes claros.',
      medidas: '26 cm de altura · 18 cm de diâmetro' }
  ];

  const porId = (id) => PRODUTOS.find((p) => p.id === Number(id));

  /* ---------- Ilustrações em SVG (no lugar de fotos) ---------- */
  function arte(tipo, esmalte) {
    const m = esmalte.principal;
    const a = esmalte.detalhe;
    const formas = {
      vaso:
        `<svg viewBox="0 0 120 150" aria-hidden="true"><path d="M45 10h30v14c0 6 18 14 18 44 0 40-14 66-33 66S27 108 27 68c0-30 18-38 18-44z" fill="${m}"/><rect x="43" y="8" width="34" height="7" rx="3" fill="${a}" opacity=".9"/><path d="M33 70q27 14 54 0M35 90q25 12 50 0" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
      garrafa:
        `<svg viewBox="0 0 120 150" aria-hidden="true"><path d="M52 8h16v32c0 12 22 22 22 54 0 28-12 44-30 44S30 122 30 94c0-32 22-42 22-54z" fill="${m}"/><rect x="50" y="6" width="20" height="6" rx="3" fill="${a}" opacity=".9"/><path d="M34 92q26 14 52 0" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
      xicara:
        `<svg viewBox="0 0 160 120" aria-hidden="true"><ellipse cx="75" cy="104" rx="58" ry="9" fill="${a}" opacity=".55"/><path d="M124 40c26-2 26 34-4 36" fill="none" stroke="${m}" stroke-width="9" stroke-linecap="round"/><path d="M25 28h100c0 44-14 72-50 72S25 72 25 28z" fill="${m}"/><ellipse cx="75" cy="28" rx="50" ry="6" fill="${a}" opacity=".85"/><path d="M32 58q43 12 86 0" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
      prato:
        `<svg viewBox="0 0 180 110" aria-hidden="true"><ellipse cx="90" cy="64" rx="82" ry="32" fill="${m}"/><ellipse cx="90" cy="60" rx="58" ry="20" fill="${a}" opacity=".55"/><ellipse cx="90" cy="60" rx="58" ry="20" fill="none" stroke="${m}" stroke-width="1.5" opacity=".5"/></svg>`,
      tigela:
        `<svg viewBox="0 0 180 120" aria-hidden="true"><path d="M18 40h144c0 44-30 68-72 68S18 84 18 40z" fill="${m}"/><ellipse cx="90" cy="40" rx="72" ry="10" fill="${a}" opacity=".8"/><path d="M34 68q56 16 112 0" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
      jarra:
        `<svg viewBox="0 0 150 150" aria-hidden="true"><path d="M104 52c34-4 34 40-2 46" fill="none" stroke="${m}" stroke-width="9" stroke-linecap="round"/><path d="M40 22h50l-6 14c18 14 22 30 22 52 0 30-16 46-40 46S26 118 26 88c0-22 6-38 20-52z" fill="${m}"/><rect x="38" y="19" width="54" height="6" rx="3" fill="${a}"/><path d="M30 84q36 14 72 0" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`
    };
    return formas[tipo] || formas.vaso;
  }

  // Preenche qualquer elemento que tenha data-art (usado no hero e na seção "sobre")
  $$('[data-art]').forEach((el) => {
    el.innerHTML = arte(el.dataset.art, ESMALTES[el.dataset.glaze] || ESMALTES.terracota);
  });

  /* ---------- Toast (aviso rápido) ---------- */
  const toast = $('#toast');
  let tempoToast;
  function avisar(texto) {
    toast.textContent = texto;
    toast.classList.add('show');
    clearTimeout(tempoToast);
    tempoToast = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ---------- Animação de entrada ao rolar (IntersectionObserver) ---------- */
  const observadorReveal = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      observadorReveal.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  function observarReveals(base = document) {
    $$('.reveal:not(.in)', base).forEach((el) => {
      if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 'ms';
      observadorReveal.observe(el);
    });
  }
  observarReveals();

  // Título do hero: as palavras sobem uma a uma
  requestAnimationFrame(() => $('.hero').classList.add('ready'));

  /* ---------- Navbar: sombra, barra de progresso e link ativo ---------- */
  const nav = $('#nav');
  const progresso = $('#progress');

  function aoRolar() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progresso.style.transform = `scaleX(${total > 0 ? y / total : 0})`;
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  const linksNav = $$('.nav__links a');
  const observadorSecoes = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      linksNav.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => observadorSecoes.observe(s));

  /* ---------- Menu mobile ---------- */
  const burger = $('#burger');
  function alternarMenu(abrir) {
    nav.classList.toggle('menu-open', abrir);
    burger.setAttribute('aria-expanded', String(abrir));
    burger.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('lock', abrir);
  }
  burger.addEventListener('click', () => alternarMenu(!nav.classList.contains('menu-open')));
  linksNav.forEach((l) => l.addEventListener('click', () => alternarMenu(false)));

  /* ---------- Faixa animada: duplica o conteúdo para o loop ficar contínuo ---------- */
  const faixa = $('#marquee');
  faixa.innerHTML += faixa.innerHTML;

  /* ---------- Parallax suave no hero (só com mouse) ---------- */
  if (!reduzirMovimento && window.matchMedia('(pointer: fine)').matches) {
    const flutuantes = $$('.float');
    window.addEventListener('pointermove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      flutuantes.forEach((el) => {
        const d = Number(el.dataset.depth) || 0;
        el.style.setProperty('--tx', (x * d).toFixed(1) + 'px');
        el.style.setProperty('--ty', (y * d).toFixed(1) + 'px');
      });
    }, { passive: true });
  }

  /* ---------- Coleções: filtro e cards ---------- */
  const grade = $('#grid');
  let filtro = 'todas';

  function htmlCard(p) {
    const e = ESMALTES[p.esmalte];
    return `
      <article class="card reveal">
        <button class="card__art" data-abrir="${p.id}" style="--bg:${p.fundo}" aria-label="Ver detalhes de ${p.nome}">
          ${arte(p.tipo, e)}
          <span class="card__tag">${CATEGORIAS[p.cat]}</span>
        </button>
        <div class="card__body">
          <h3>${p.nome}</h3>
          <p>${p.resumo}</p>
          <div class="card__foot">
            <span class="price">${brl(p.preco)}</span>
            <button class="btn btn--small" data-adicionar="${p.id}">+ Encomenda</button>
          </div>
        </div>
      </article>`;
  }

  function desenharGrade() {
    const lista = PRODUTOS.filter((p) => filtro === 'todas' || p.cat === filtro);
    grade.innerHTML = lista.map(htmlCard).join('');
    // pequeno atraso em escada para os cards entrarem um depois do outro
    $$('.card', grade).forEach((c, i) => { c.dataset.delay = String(i * 70); });
    observarReveals(grade);
  }

  $$('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      filtro = chip.dataset.filter;
      $$('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      desenharGrade();
    });
  });

  grade.addEventListener('click', (ev) => {
    const abrir = ev.target.closest('[data-abrir]');
    const adicionar = ev.target.closest('[data-adicionar]');
    if (abrir) abrirModal(abrir.dataset.abrir);
    if (adicionar) {
      const p = porId(adicionar.dataset.adicionar);
      adicionarAoCarrinho(p.id, p.esmalte, 1);
    }
  });

  desenharGrade();

  /* ---------- Carrinho (lista de encomenda) ---------- */
  let carrinho = ler('aura-encomenda', []); // [{ id, esmalte, qtd }]

  const botaoCarrinho = $('#cartBtn');
  const contador = $('#cartCount');
  const gaveta = $('#drawer');
  const sobreposicao = $('#overlay');
  const corpoGaveta = $('#drawerBody');
  const rodapeGaveta = $('#drawerFoot');

  const totalItens = () => carrinho.reduce((s, i) => s + i.qtd, 0);
  const totalValor = () => carrinho.reduce((s, i) => s + porId(i.id).preco * i.qtd, 0);

  function adicionarAoCarrinho(id, esmalte, qtd) {
    const existente = carrinho.find((i) => i.id === id && i.esmalte === esmalte);
    if (existente) existente.qtd += qtd;
    else carrinho.push({ id, esmalte, qtd });
    salvarCarrinho();
    avisar(`${porId(id).nome} adicionado à encomenda`);
    botaoCarrinho.classList.remove('bump');
    void botaoCarrinho.offsetWidth; // reinicia a animação
    botaoCarrinho.classList.add('bump');
  }

  function mudarQuantidade(indice, delta) {
    carrinho[indice].qtd += delta;
    if (carrinho[indice].qtd <= 0) carrinho.splice(indice, 1);
    salvarCarrinho();
  }

  function removerItem(indice) {
    carrinho.splice(indice, 1);
    salvarCarrinho();
  }

  function salvarCarrinho() {
    guardar('aura-encomenda', carrinho);
    desenharCarrinho();
  }

  function mensagemWhatsApp() {
    const linhas = carrinho.map((i) => {
      const p = porId(i.id);
      return `- ${i.qtd}x ${p.nome} (${ESMALTES[i.esmalte].nome}) — ${brl(p.preco * i.qtd)}`;
    });
    return `Olá, Aura! Gostaria de encomendar:\n${linhas.join('\n')}\n\nTotal estimado: ${brl(totalValor())}`;
  }

  function desenharCarrinho() {
    contador.textContent = totalItens();

    if (carrinho.length === 0) {
      corpoGaveta.innerHTML = `
        <div class="empty">
          <div>${arte('vaso', ESMALTES.areia)}</div>
          <p>Sua lista está vazia.<br>Escolha uma peça nas coleções.</p>
        </div>`;
      rodapeGaveta.hidden = true;
      return;
    }

    corpoGaveta.innerHTML = carrinho.map((i, idx) => {
      const p = porId(i.id);
      return `
        <div class="item">
          <div class="item__art" style="--bg:${p.fundo}">${arte(p.tipo, ESMALTES[i.esmalte])}</div>
          <div>
            <h4>${p.nome}</h4>
            <small>${ESMALTES[i.esmalte].nome}</small>
            <div class="qty">
              <button data-menos="${idx}" aria-label="Diminuir quantidade">−</button>
              <span>${i.qtd}</span>
              <button data-mais="${idx}" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>
          <div class="item__side">${brl(p.preco * i.qtd)}
            <button class="item__rm" data-remover="${idx}">remover</button>
          </div>
        </div>`;
    }).join('');

    rodapeGaveta.hidden = false;
    rodapeGaveta.innerHTML = `
      <div class="drawer__total"><span>Total estimado</span><strong>${brl(totalValor())}</strong></div>
      <a class="btn btn--primary btn--block" id="enviarZap" target="_blank" rel="noopener"
         href="https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagemWhatsApp())}">Enviar pelo WhatsApp</a>
      <p class="drawer__note">Valores estimados. Confirmamos prazo e frete pelo WhatsApp.</p>`;
  }

  corpoGaveta.addEventListener('click', (ev) => {
    const menos = ev.target.closest('[data-menos]');
    const mais = ev.target.closest('[data-mais]');
    const remover = ev.target.closest('[data-remover]');
    if (menos) mudarQuantidade(Number(menos.dataset.menos), -1);
    if (mais) mudarQuantidade(Number(mais.dataset.mais), 1);
    if (remover) removerItem(Number(remover.dataset.remover));
  });

  function abrirGaveta() {
    gaveta.classList.add('open');
    gaveta.setAttribute('aria-hidden', 'false');
    sobreposicao.classList.add('show');
    document.body.classList.add('lock');
    $('#drawerClose').focus();
  }
  function fecharGaveta() {
    gaveta.classList.remove('open');
    gaveta.setAttribute('aria-hidden', 'true');
    sobreposicao.classList.remove('show');
    document.body.classList.remove('lock');
    botaoCarrinho.focus();
  }
  botaoCarrinho.addEventListener('click', abrirGaveta);
  $('#drawerClose').addEventListener('click', fecharGaveta);
  sobreposicao.addEventListener('click', fecharGaveta);

  desenharCarrinho();

  /* ---------- Modal da peça (elemento <dialog>) ---------- */
  const modal = $('#modal');
  const modalArte = $('#modalArt');
  const modalInfo = $('#modalInfo');
  let atual = null; // { id, esmalte, qtd }

  function abrirModal(id) {
    const p = porId(id);
    atual = { id: p.id, esmalte: p.esmalte, qtd: 1 };
    desenharModal();
    modal.showModal();
  }

  function desenharModal() {
    const p = porId(atual.id);
    modalArte.style.setProperty('--bg', p.fundo);
    modalArte.innerHTML = arte(p.tipo, ESMALTES[atual.esmalte]);

    const opcoes = Object.keys(ESMALTES).map((chave) => `
      <button class="swatch" data-esmalte="${chave}" aria-pressed="${chave === atual.esmalte}">
        <i style="background:${ESMALTES[chave].cor}"></i>${ESMALTES[chave].nome}
      </button>`).join('');

    modalInfo.innerHTML = `
      <span class="card__tag">${CATEGORIAS[p.cat]}</span>
      <h2 id="modalTitle">${p.nome}</h2>
      <p>${p.detalhe}</p>
      <div class="specs"><span><strong>Medidas:</strong> ${p.medidas}</span><span><strong>Feito:</strong> à mão, sob encomenda em até 3 semanas</span></div>
      <div>
        <p class="opt-label">Esmalte</p>
        <div class="swatches" style="margin-top:.5rem">${opcoes}</div>
      </div>
      <div class="modal__buy">
        <div class="qty">
          <button data-qtd="-1" aria-label="Diminuir quantidade">−</button>
          <span aria-live="polite">${atual.qtd}</span>
          <button data-qtd="1" aria-label="Aumentar quantidade">+</button>
        </div>
        <span class="modal__price">${brl(p.preco * atual.qtd)}</span>
        <button class="btn btn--primary" data-confirmar>Adicionar à encomenda</button>
      </div>`;
  }

  modalInfo.addEventListener('click', (ev) => {
    const esmalte = ev.target.closest('[data-esmalte]');
    const qtd = ev.target.closest('[data-qtd]');
    const confirmar = ev.target.closest('[data-confirmar]');
    if (esmalte) { atual.esmalte = esmalte.dataset.esmalte; desenharModal(); }
    if (qtd) { atual.qtd = Math.min(10, Math.max(1, atual.qtd + Number(qtd.dataset.qtd))); desenharModal(); }
    if (confirmar) {
      adicionarAoCarrinho(atual.id, atual.esmalte, atual.qtd);
      modal.close();
    }
  });

  $('#modalClose').addEventListener('click', () => modal.close());
  // clicar fora da caixa (no fundo escuro) também fecha
  modal.addEventListener('click', (ev) => { if (ev.target === modal) modal.close(); });

  // Esc fecha a gaveta
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (gaveta.classList.contains('open')) fecharGaveta();
      if (nav.classList.contains('menu-open')) alternarMenu(false);
    }
  });

  /* ---------- Contadores animados (seção sobre) ---------- */
  function contar(el) {
    const alvo = Number(el.dataset.count);
    const sufixo = el.dataset.suffix || '';
    if (reduzirMovimento) { el.textContent = alvo.toLocaleString('pt-BR') + sufixo; return; }
    const inicio = performance.now();
    const duracao = 1600;
    function passo(agora) {
      const k = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - k, 3); // desacelera no final
      el.textContent = Math.round(alvo * suave).toLocaleString('pt-BR') + sufixo;
      if (k < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }
  const observadorContagem = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      contar(e.target);
      observadorContagem.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => observadorContagem.observe(el));

  /* ---------- Carrossel de depoimentos ---------- */
  (function carrossel() {
    const trilho = $('#track');
    const slides = $$('.quote', trilho);
    const pontos = $('#dots');
    const caixa = $('#carousel');
    let indice = 0;
    let timer;

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Depoimento ${i + 1}`);
      b.addEventListener('click', () => { ir(i); reiniciar(); });
      pontos.appendChild(b);
    });

    function ir(i) {
      indice = (i + slides.length) % slides.length;
      trilho.style.transform = `translateX(-${indice * 100}%)`;
      $$('.dot', pontos).forEach((d, n) => d.setAttribute('aria-selected', String(n === indice)));
    }
    function reiniciar() {
      clearInterval(timer);
      if (!reduzirMovimento) timer = setInterval(() => ir(indice + 1), 6500);
    }

    $('#prev').addEventListener('click', () => { ir(indice - 1); reiniciar(); });
    $('#next').addEventListener('click', () => { ir(indice + 1); reiniciar(); });
    caixa.addEventListener('mouseenter', () => clearInterval(timer));
    caixa.addEventListener('mouseleave', reiniciar);

    // arrastar com o dedo (ou mouse)
    let xInicial = null;
    trilho.addEventListener('pointerdown', (e) => { xInicial = e.clientX; });
    window.addEventListener('pointerup', (e) => {
      if (xInicial === null) return;
      const dx = e.clientX - xInicial;
      xInicial = null;
      if (Math.abs(dx) > 50) { ir(indice + (dx < 0 ? 1 : -1)); reiniciar(); }
    });

    ir(0);
    reiniciar();
  })();

  /* ---------- FAQ (acordeão) ---------- */
  $$('.faq__q').forEach((botao) => {
    botao.addEventListener('click', () => {
      const item = botao.closest('.faq__item');
      const abrir = !item.classList.contains('open');
      // fecha os outros para manter só um aberto
      $$('.faq__item.open').forEach((o) => {
        o.classList.remove('open');
        $('.faq__q', o).setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('open', abrir);
      botao.setAttribute('aria-expanded', String(abrir));
    });
  });

  /* ---------- Formulário de contato com validação ---------- */
  const form = $('#form');
  const campos = ['nome', 'email', 'mensagem'].map((id) => $('#' + id));

  function validar(campo) {
    const v = campo.value.trim();
    if (!v) return 'Preencha este campo.';
    if (campo.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Digite um e-mail válido.';
    if (campo.id === 'mensagem' && v.length < 10) return 'Conte um pouco mais (mínimo de 10 caracteres).';
    return '';
  }

  function mostrarErro(campo, msg) {
    campo.closest('.field').classList.toggle('invalid', Boolean(msg));
    $('#' + campo.id + '-erro').textContent = msg;
    campo.setAttribute('aria-invalid', String(Boolean(msg)));
  }

  campos.forEach((c) => {
    c.addEventListener('blur', () => mostrarErro(c, validar(c)));
    c.addEventListener('input', () => { if (c.closest('.field').classList.contains('invalid')) mostrarErro(c, validar(c)); });
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let primeiroErro = null;
    campos.forEach((c) => {
      const msg = validar(c);
      mostrarErro(c, msg);
      if (msg && !primeiroErro) primeiroErro = c;
    });
    if (primeiroErro) { primeiroErro.focus(); return; }

    const botao = $('#submitBtn');
    botao.classList.add('loading');
    botao.textContent = 'Enviando…';

    // Simulação: aqui entraria o envio de verdade (fetch para uma API ou serviço de formulários)
    setTimeout(() => {
      form.reset();
      botao.classList.remove('loading');
      botao.textContent = 'Enviar mensagem';
      $('#formOk').hidden = false;
      setTimeout(() => { $('#formOk').hidden = true; }, 6000);
    }, 900);
  });

  /* ---------- Rodapé ---------- */
  $('#year').textContent = new Date().getFullYear();
})();