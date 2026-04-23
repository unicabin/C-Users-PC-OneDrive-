@echo off
cd /d "c:\Users\PC\OneDrive\문서\홈페이지\AI기업도입"

set LOG=c:\Users\PC\OneDrive\문서\홈페이지\AI기업도입\_claude-task-log.txt
echo. >> %LOG%
echo ===== %DATE% %TIME% ===== >> %LOG%

claude --dangerously-skip-permissions -p "CLAUDE.md를 읽고 체크리스트에서 아직 구현되지 않은 다음 단계로 진행해줘. 파일을 실제로 생성하고 수정해줘. 완료된 단계는 CLAUDE.md 체크리스트에 [x]로 표시해줘." >> %LOG% 2>&1

echo 완료: %DATE% %TIME% >> %LOG%
