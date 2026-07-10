'use client';

import { useModalA11y } from '@hooks/use-modal-a11y';
import { IconList, IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Toc, TocItem } from './toc';

export interface MobileTocProps {
  toc: TocItem[];
  activeId: string;
  onFragIdChanged: (param: { fragId: string }) => void;
}

/**
 * xl(1280px) 미만 전용 목차 UI(#85).
 *
 * 데스크톱 ToC 패널은 `hidden xl:flex`라 1280px 미만에서 완전히 사라지므로,
 * 우하단 플로팅 버튼 → 바텀시트로 대체 수단을 제공한다.
 * 목차 데이터·스크롤스파이(activeId)·항목 렌더링은 기존 Toc/PostDetail 로직을 그대로 재사용하고,
 * 배경 격리(portal + inert + body 스크롤 잠금)는 공용 useModalA11y 훅(#106)으로 처리한다.
 */
export function MobileToc({ toc, activeId, onFragIdChanged }: MobileTocProps) {
  const [open, setOpen] = useState(false);

  // 트리거와 시트를 aria-controls로 연결하기 위한 고유 id.
  const sheetId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // 사용자가 명시적으로(닫기 버튼/Esc/배경 클릭) 닫을 때만 트리거로 포커스를 되돌리기 위한 플래그.
  const restoreFocusRef = useRef(false);

  // 닫기 버튼/Esc/배경 클릭으로 닫을 때 사용한다. 닫은 뒤 트리거로 포커스를 되돌리도록 표시한다.
  const closeSheet = () => {
    restoreFocusRef.current = true;
    setOpen(false);
  };

  // 배경(body) 스크롤 잠금 + 배경 콘텐츠 inert 격리를 공용 훅으로 일원화한다(#106).
  // dialogRef는 document.body에 포털로 렌더되는 최상위 요소를 가리키며 포커스 트랩 범위로도 쓴다.
  const { mounted, dialogRef } = useModalA11y(open);

  // xl(1280px) 이상으로 넓어지면 시트를 닫는다. 닫지 않으면 트리거가 xl:hidden으로
  // 숨겨진 채 시트만 남고, 스크롤 잠금·inert도 해제되지 않는다(mobile-sidebar와 동일 패턴).
  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

  // 열리면 닫기 버튼으로 포커스를 옮긴다. 사용자가 닫은 경우에만 트리거로 되돌린다.
  // (리사이즈로 닫히는 경우엔 트리거가 xl:hidden이라 포커스가 유실되므로 되돌리지 않는다.)
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    } else if (restoreFocusRef.current) {
      triggerRef.current?.focus();
      restoreFocusRef.current = false;
    }
  }, [open]);

  // Esc로 닫고, Tab은 시트 내부에 가둔다(포커스 트랩 — mobile-sidebar와 동일 패턴).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      closeSheet();
      return;
    }
    if (e.key === 'Tab') {
      const sheet = dialogRef.current;
      if (!sheet) return;
      const focusables = sheet.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus(); // 처음에서 Shift+Tab → 마지막으로 순환
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus(); // 마지막에서 Tab → 처음으로 순환
      }
    }
  };

  // 헤딩이 없는 짧은 글은 목차 자체가 무의미하므로 플로팅 버튼도 렌더하지 않는다.
  if (toc.length === 0) {
    return null;
  }

  return (
    <>
      {/* ------------------------------------------------------ */}
      {/* MOBILE TOC TRIGGER (우하단 플로팅 버튼) */}
      {/* ------------------------------------------------------ */}
      {/* 데스크톱 ToC 패널이 노출되는 xl 이상에서는 숨긴다(중복 방지). */}
      <button
        type="button"
        ref={triggerRef}
        aria-label="목차 열기"
        aria-expanded={open}
        aria-controls={sheetId}
        onClick={() => setOpen(true)}
        className={classNames(
          'fixed bottom-5 right-5 z-40 xl:hidden cursor-pointer',
          // 탭 영역 확보를 위한 원형 버튼. 어두운 헤더와 같은 ink 토큰으로 본문 위에서 또렷하게 띄운다.
          'flex items-center justify-center w-12 h-12 rounded-full bg-ink text-white shadow-lg',
        )}
      >
        <IconList aria-hidden className="w-5 h-5" />
      </button>

      {/* ------------------------------------------------------ */}
      {/* MOBILE TOC BOTTOM SHEET */}
      {/* ------------------------------------------------------ */}
      {/* document.body에 직접 포털로 렌더한다. 그래야 useModalA11y가 이 요소를 제외한
          body의 다른 모든 자식(헤더·본문 등)에 inert를 적용해 배경을 완전히 격리할 수 있다(#106).
          mounted 이전(SSR)에는 document가 없으므로 렌더하지 않는다. */}
      {mounted &&
        createPortal(
          // 시트를 항상 마운트해 두고 transform으로만 열고 닫는다(mobile-sidebar와 동일).
          // 매번 마운트하면 Toc의 해시 딥링크 효과가 시트를 열 때마다 재실행되는 부작용이 있다.
          // 닫힌 동안에는 inert로 내부 요소를 포커스/스크린리더에서 제외한다.
          <div ref={dialogRef} inert={!open} onKeyDown={onKeyDown} className="xl:hidden">
            {/* 배경 딤 오버레이. 클릭하면 닫힌다. 닫힌 동안에는 클릭을 가로채지 않도록 pointer-events를 끈다. */}
            <div
              aria-hidden
              onClick={closeSheet}
              className={classNames(
                'fixed inset-0 z-50 bg-ink/50 transition-opacity duration-300',
                open ? 'opacity-100' : 'opacity-0 pointer-events-none',
              )}
            />

            {/* 바텀시트 본체 */}
            <div
              id={sheetId}
              role="dialog"
              aria-modal="true"
              aria-label="목차"
              className={classNames(
                // 화면 하단에 붙는 시트. 목차가 길어도 화면을 다 덮지 않도록 최대 높이를 제한한다.
                'fixed bottom-0 left-0 right-0 z-50 max-h-[70dvh] rounded-t-xl bg-surface shadow-2xl',
                // 헤더는 고정하고 목차 영역만 스크롤시키기 위해 세로 flex 컬럼으로 구성한다.
                'flex flex-col',
                // 전이는 세로 슬라이드(transform)로 한정한다(높이 변화 애니메이션 잔상 방지).
                'transition-transform duration-300',
                open ? 'translate-y-0' : 'translate-y-full',
              )}
            >
              {/* 시트 헤더: 제목 + 닫기 버튼 */}
              <div className="flex items-center justify-between px-5 h-[52px] border-b border-border shrink-0">
                <span className="text-sm font-medium text-black">목차</span>
                {/* 탭 영역 확대를 위해 닫기 버튼에 패딩(p-2.5)을 준다(아이콘 크기는 유지). */}
                <button
                  type="button"
                  ref={closeButtonRef}
                  aria-label="목차 닫기"
                  onClick={closeSheet}
                  className="flex items-center cursor-pointer p-2.5 -mr-2.5 text-black"
                >
                  <IconX aria-hidden className="w-5 h-5" />
                </button>
              </div>

              {/* 목차 본문: 기존 Toc 컴포넌트를 재사용하되, 사이드 패널용 고정 폭 대신 시트에 맞는 클래스를 준다. */}
              {/* overscroll-contain: 끝단에서 스크롤이 배경 문서로 전파되는 것을 막는다. */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2 text-black">
                <Toc
                  className="w-full"
                  toc={toc}
                  activeId={activeId}
                  onFragIdChanged={(param) => {
                    // 항목 선택 시 시트를 닫고 나서 부모의 스크롤 이동을 그대로 위임한다.
                    // Toc의 해시 딥링크 효과가 마운트 시(시트가 닫힌 상태)에도 호출하므로,
                    // 열려 있을 때만 닫아 포커스 복원 플래그가 잘못 세팅되지 않게 한다.
                    if (open) {
                      closeSheet();
                    }
                    onFragIdChanged(param);
                  }}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
