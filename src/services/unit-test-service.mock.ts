/**
 * Unit Test 에이전트 결과 리포트의 대용량 raw 데이터.
 * 합의된 인터페이스는 docs/reference/agent_outputs/unittest.html 의 DATA 상수.
 *
 * 도메인 파일 규칙(CLAUDE.md):
 *   대용량 raw 문자열만 분리. 구조 데이터는 service 파일 inline.
 */

// String.raw 사용 — C 소스의 백슬래시(printf escape, 매크로 라인 연속)를
// 손실 없이 보존한다. 백틱과 ${ 가 C 소스에 없음을 확인한 뒤 사용.

const TEST_FILE_NAME = "test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c";

const TEST_FILE_CONTENT = String.raw`/*
 * test_vi_1_3_4_5_8_17_run_dry_fct_mode_process.c
 * VI #1: FCT 초기 진입 시 'sucSubStep'가 항상 0으로 초기화되는지 확인
 * VI #3: 팬 속도 목표 도달 전에는 REF 판정 기준 온도가 저장되지 않는지 확인
 * VI #4: 팬 속도 목표 도달 후 90초 경과 시점에만 REF 오류 판정이 수행되는지 확인
 * VI #5: 냉각 성능 부족 시 'HP_ERROR_REF'가 정상 설정되는지 확인
 * VI #8: 정적 변수 'snStartEva', 'sucSubStep', 타이머가 시험 중단/재시작 시 의도대로 재초기화되는지 확인
 * VI #17: 팬 속도 미도달 상태가 지속될 때 REF 판정이 조기 수행되지 않는지 확인
 * 빌드: gcc -std=c11 -Wall -Werror test_vi_1_3_4_5_8_17_run_dry_fct_mode_process.c -o test_vi_1_3_4_5_8_17_run_dry_fct_mode_process
 */
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>

/* ========== 1. 타입/매크로 Stub ========== */
typedef uint8_t UINT8;
typedef uint16_t UINT16;
typedef uint32_t UINT32;
typedef int16_t INT16;

typedef struct {
    UINT32 ulLow;
} T_Time;

typedef struct {
    UINT8 dummy;
} T_KeyInformDef;

typedef struct {
    UINT16 FanSpeed;
} T_HP_ReceiveInfo;

#define CLEAR 0
#define DONE 1
#define DOOR_LOCK 2
#define DRY_TEST_COMP_HZ ((UINT8) 82)
#define DRY_TEST_EEV ((UINT16) 95)
#define DRY_TEST_FAN_RPM ((UINT16) 3000)
#define FCT_FINAL_STEP 6
#define FCT_INIT_STEP 0
#define FCT_LOAD5_STEP 5
#define HP_ERROR_REF 83
#define INITIAL 0
#define MAIN_STATE_END 3
#define MAIN_STATE_ERROR 1
#define MAIN_STATE_TEST_DRY_FCT 31
#define MOTOR_NORMAL_MODE 2
#define OFF 0
#define SET 1
#define WRITE 0
#define _DRY_EVA_IN_TEMP_ 3

UINT8 gucFCT_ModeIndex;
UINT8 mucLogFCTStep;
UINT8 aucErrorStatus[256];
static T_HP_ReceiveInfo mstHP_ReceiveInfo;

/* ========== 2. Mock 프레임워크 ========== */
typedef struct {
    char name[64];
    long a1;
    long a2;
    long a3;
    long a4;
} MockCall;

static MockCall g_calls[512];
static int g_call_count;

static void record_call(const char *name, long a1, long a2, long a3, long a4)
{
    if (g_call_count < 512) {
        snprintf(g_calls[g_call_count].name, sizeof(g_calls[g_call_count].name), "%s", name);
        g_calls[g_call_count].a1 = a1;
        g_calls[g_call_count].a2 = a2;
        g_calls[g_call_count].a3 = a3;
        g_calls[g_call_count].a4 = a4;
        g_call_count++;
    }
}

static int count(const char *name)
{
    int n = 0;
    for (int i = 0; i < g_call_count; i++) {
        if (strcmp(g_calls[i].name, name) == 0) {
            n++;
        }
    }
    return n;
}

static MockCall *nth(const char *name, int index)
{
    int n = 0;
    for (int i = 0; i < g_call_count; i++) {
        if (strcmp(g_calls[i].name, name) == 0) {
            if (n == index) {
                return &g_calls[i];
            }
            n++;
        }
    }
    return NULL;
}

static int first_index(const char *name)
{
    for (int i = 0; i < g_call_count; i++) {
        if (strcmp(g_calls[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

static int nth_index(const char *name, int index)
{
    int n = 0;
    for (int i = 0; i < g_call_count; i++) {
        if (strcmp(g_calls[i].name, name) == 0) {
            if (n == index) {
                return i;
            }
            n++;
        }
    }
    return -1;
}

static UINT8 g_status_seq[64];
static int g_status_len;
static int g_status_idx;
static UINT8 g_concurrent_ret;
static UINT8 g_door_ret;
static UINT32 g_timer_get_value;
static UINT8 g_timer_sec_ret[64];
static int g_timer_sec_len;
static int g_timer_sec_idx;
static INT16 g_temp_ret[64];
static int g_temp_len;
static int g_temp_idx;

static void mock_reset(void)
{
    memset(g_calls, 0, sizeof(g_calls));
    g_call_count = 0;
    memset(g_status_seq, 0, sizeof(g_status_seq));
    g_status_len = 0;
    g_status_idx = 0;
    g_concurrent_ret = CLEAR;
    g_door_ret = CLEAR;
    g_timer_get_value = 1000u;
    memset(g_timer_sec_ret, 0, sizeof(g_timer_sec_ret));
    g_timer_sec_len = 0;
    g_timer_sec_idx = 0;
    memset(g_temp_ret, 0, sizeof(g_temp_ret));
    g_temp_len = 0;
    g_temp_idx = 0;
    mucLogFCTStep = 0;
    memset(aucErrorStatus, 0, sizeof(aucErrorStatus));
    memset(&mstHP_ReceiveInfo, 0, sizeof(mstHP_ReceiveInfo));
}

static void configure_status_iterations(int iterations)
{
    memset(g_status_seq, 0, sizeof(g_status_seq));
    for (int i = 0; i < iterations; i++) {
        g_status_seq[i] = MAIN_STATE_TEST_DRY_FCT;
    }
    g_status_seq[iterations] = MAIN_STATE_END;
    g_status_len = iterations + 1;
    g_status_idx = 0;
}

static void set_timer_returns(const UINT8 *values, int len)
{
    memset(g_timer_sec_ret, 0, sizeof(g_timer_sec_ret));
    for (int i = 0; i < len; i++) {
        g_timer_sec_ret[i] = values[i];
    }
    g_timer_sec_len = len;
    g_timer_sec_idx = 0;
}

static void set_temp_returns(const INT16 *values, int len)
{
    memset(g_temp_ret, 0, sizeof(g_temp_ret));
    for (int i = 0; i < len; i++) {
        g_temp_ret[i] = values[i];
    }
    g_temp_len = len;
    g_temp_idx = 0;
}

/* ========== 3. 외부 의존성 Mock ========== */
void Comm_SetFCTStep(UINT8 step)
{
    record_call("Comm_SetFCTStep", (long)step, 0, 0, 0);
    mucLogFCTStep = step;
}

UINT8 ConCurrentFuction(T_KeyInformDef *psKeyInput, UINT8 mode)
{
    record_call("ConCurrentFuction", (long)(uintptr_t)psKeyInput, (long)mode, 0, 0);
    return g_concurrent_ret;
}

void FCTWorkState_EndCheck(UINT8 ret)
{
    record_call("FCTWorkState_EndCheck", (long)ret, 0, 0, 0);
}

void Init_FCTTestModeProcess(void)
{
    record_call("Init_FCTTestModeProcess", 0, 0, 0, 0);
}

void KeyInputControl_FCTWorkState(UINT8 key)
{
    record_call("KeyInputControl_FCTWorkState", (long)key, 0, 0, 0);
}

INT16 MWI_ADSS_GetDryTemperature(UINT8 thermistorType)
{
    INT16 ret = 0;
    record_call("MWI_ADSS_GetDryTemperature", (long)thermistorType, 0, 0, 0);
    if (g_temp_idx < g_temp_len) {
        ret = g_temp_ret[g_temp_idx++];
    }
    return ret;
}

UINT8 MWI_Door_SetDoorControlCMD(UINT8 readWrite, UINT8 doorCtrlReq)
{
    record_call("MWI_Door_SetDoorControlCMD", (long)readWrite, (long)doorCtrlReq, 0, 0);
    return g_door_ret;
}

void MWI_HP_FctModeDryLoadControl(UINT8 compHz, UINT16 eev, UINT16 fanRpm)
{
    record_call("MWI_HP_FctModeDryLoadControl", (long)compHz, (long)eev, (long)fanRpm, 0);
}

void MWI_HP_ManualControl(int mode, UINT8 value)
{
    record_call("MWI_HP_ManualControl", (long)mode, (long)value, 0, 0);
}

T_HP_ReceiveInfo *MW_HP_GetReceiveInfo(void)
{
    record_call("MW_HP_GetReceiveInfo", 0, 0, 0, 0);
    return &mstHP_ReceiveInfo;
}

UINT8 Sys_GetMainStatus(void)
{
    UINT8 ret = MAIN_STATE_END;
    record_call("Sys_GetMainStatus", 0, 0, 0, 0);
    if (g_status_idx < g_status_len) {
        ret = g_status_seq[g_status_idx++];
    }
    return ret;
}

void Sys_SetErrorStatus(UINT8 error, UINT8 value)
{
    record_call("Sys_SetErrorStatus", (long)error, (long)value, 0, 0);
    aucErrorStatus[error] = value;
}

void Timer_GetTime(T_Time *pstTime)
{
    record_call("Timer_GetTime", (long)(uintptr_t)pstTime, 0, 0, 0);
    pstTime->ulLow = g_timer_get_value;
}

UINT8 Timer_SecCheckPassTime(T_Time *pstTime, UINT32 time, UINT8 updateOption)
{
    UINT8 ret = CLEAR;
    record_call("Timer_SecCheckPassTime", (long)(uintptr_t)pstTime, (long)time, (long)updateOption, 0);
    if (g_timer_sec_idx < g_timer_sec_len) {
        ret = g_timer_sec_ret[g_timer_sec_idx++];
    }
    return ret;
}

/* ========== 4. FUT (원본 출처: CommonSource/1_Application/Source/App_FCT_TestModeState_B.C:159-222) ========== */
void Run_DRY_FCT_ModeProcess(T_KeyInformDef* psKeyInput)
{
    UINT8 ucNewKey = 0;
    UINT8 ucRetVal = CLEAR;
    static INT16 snStartEva = 0;
    static UINT8 sucSubStep = 0;
    static T_Time stRefCheckTimer = {0,};

    Init_FCTTestModeProcess();
    MWI_Door_SetDoorControlCMD(WRITE, DOOR_LOCK);

    while(Sys_GetMainStatus() == MAIN_STATE_TEST_DRY_FCT)
    {
        ucNewKey = ConCurrentFuction(psKeyInput, MOTOR_NORMAL_MODE);
        KeyInputControl_FCTWorkState(ucNewKey);

        switch(gucFCT_ModeIndex)
        {
            case FCT_INIT_STEP:
                MWI_HP_ManualControl(INITIAL, 0);
                sucSubStep = 0;
                Timer_GetTime(&stRefCheckTimer);
                gucFCT_ModeIndex = FCT_LOAD5_STEP;
                break;

            case FCT_LOAD5_STEP:
                MWI_HP_FctModeDryLoadControl(DRY_TEST_COMP_HZ, DRY_TEST_EEV, DRY_TEST_FAN_RPM);

                if(sucSubStep == 0)
                {
                    if(MW_HP_GetReceiveInfo()->FanSpeed > (DRY_TEST_FAN_RPM - 100))
                    {
                        snStartEva = MWI_ADSS_GetDryTemperature(_DRY_EVA_IN_TEMP_);
                        sucSubStep = 1;
                    }
                }
                else if(sucSubStep == 1)
                {
                    if(Timer_SecCheckPassTime(&stRefCheckTimer, 90, 0) == SET)
                    {
                        if(snStartEva - MWI_ADSS_GetDryTemperature(_DRY_EVA_IN_TEMP_) < 2)
                        {
                            Sys_SetErrorStatus(HP_ERROR_REF, SET);
                        }
                        sucSubStep = 2;
                    }
                }
                else;
                break;

            case FCT_FINAL_STEP:
                MWI_HP_ManualControl(INITIAL, 0);
                ucRetVal = DONE;
                break;

            default :
                break;
        }

        FCTWorkState_EndCheck(ucRetVal);
        Comm_SetFCTStep(gucFCT_ModeIndex);
    }
}

/* ========== 5. 간이 assertion ========== */
static int g_fail = 0;
static int g_tc_total = 0;
static int g_tc_passed = 0;
static int g_tc_failed = 0;
static const char *g_current_tc = "";
static int g_fail_at_tc_start = 0;

static const char *_g_aise_tc_filter = (const char *)0;
static int _g_aise_filter_inited = 0;

static int _aise_should_run(const char *tc_name) {
    const char *p;
    size_t nlen;
    if (!_g_aise_filter_inited) {
        _g_aise_tc_filter = getenv("AISE_TC_FILTER");
        _g_aise_filter_inited = 1;
    }
    if (!_g_aise_tc_filter || !*_g_aise_tc_filter) return 1;
    nlen = strlen(tc_name);
    p = _g_aise_tc_filter;
    while (*p) {
        const char *q;
        while (*p == ',' || *p == ' ') p++;
        q = p;
        while (*q && *q != ',') q++;
        if ((size_t)(q - p) == nlen && strncmp(p, tc_name, nlen) == 0) return 1;
        p = q;
    }
    return 0;
}

#define EXPECT(cond) do { \
    if (!(cond)) { \
        printf("  FAIL [%s] %s:%d  %s\n", g_current_tc, __FILE__, __LINE__, #cond); \
        g_fail++; \
    } \
} while (0)

#define RUN_TC(fn) do { \
    if (!_aise_should_run(#fn)) break; \
    g_current_tc = #fn; \
    g_tc_total++; \
    g_fail_at_tc_start = g_fail; \
    printf("RUN %s\n", #fn); \
    fn(); \
    if (g_fail == g_fail_at_tc_start) { \
        g_tc_passed++; \
        printf("  PASS %s\n", #fn); \
    } else { \
        g_tc_failed++; \
        printf("  FAIL %s (%d asserts failed)\n", #fn, g_fail - g_fail_at_tc_start); \
    } \
} while (0)

/* ========== 6. 테스트 케이스 ========== */

static void run_fut_iterations(int iterations)
{
    T_KeyInformDef key;
    memset(&key, 0, sizeof(key));
    configure_status_iterations(iterations);
    Run_DRY_FCT_ModeProcess(&key);
}

static void force_init_to_load_step(void)
{
    mock_reset();
    gucFCT_ModeIndex = FCT_INIT_STEP;
    run_fut_iterations(1);
}

static void force_substep_one_with_start_temp(INT16 startTemp)
{
    INT16 temps[1];

    force_init_to_load_step();
    mock_reset();
    gucFCT_ModeIndex = FCT_LOAD5_STEP;
    mstHP_ReceiveInfo.FanSpeed = DRY_TEST_FAN_RPM;
    temps[0] = startTemp;
    set_temp_returns(temps, 1);
    run_fut_iterations(1);
}

static void force_substep_two(void)
{
    UINT8 timerRets[1];
    INT16 temps[2];

    force_init_to_load_step();
    mock_reset();
    gucFCT_ModeIndex = FCT_LOAD5_STEP;
    mstHP_ReceiveInfo.FanSpeed = DRY_TEST_FAN_RPM;
    timerRets[0] = SET;
    temps[0] = 40;
    temps[1] = 39;
    set_timer_returns(timerRets, 1);
    set_temp_returns(temps, 2);
    run_fut_iterations(2);
}

/* VI #4: 정상 부하 진행 - 90초 타이머 이후 REF 판정 순서 검증 */
static void tc_happy_full_sequence(void)
{
    UINT8 timerRets[1];
    INT16 temps[2];

    mock_reset();
    gucFCT_ModeIndex = FCT_INIT_STEP;
    mstHP_ReceiveInfo.FanSpeed = DRY_TEST_FAN_RPM;
    timerRets[0] = SET;
    temps[0] = 50;
    temps[1] = 45;
    set_timer_returns(timerRets, 1);
    set_temp_returns(temps, 2);

    run_fut_iterations(3);

    EXPECT(count("Init_FCTTestModeProcess") == 1);
    EXPECT(count("MWI_Door_SetDoorControlCMD") == 1);
    EXPECT(count("MWI_HP_ManualControl") == 1);
    EXPECT(count("MWI_HP_FctModeDryLoadControl") == 2);
    EXPECT(count("Comm_SetFCTStep") == 3);

    /* [ORACLE: VI] REF 판정은 팬 목표 도달로 기준 온도를 저장한 뒤 90초 타이머 확인 이후 비교 온도 읽기로 수행되어야 한다 */
    EXPECT(count("MWI_ADSS_GetDryTemperature") == 2);
    EXPECT(count("Timer_SecCheckPassTime") == 1);
    EXPECT(nth("Timer_SecCheckPassTime", 0)->a2 == 90);
    EXPECT(nth_index("MWI_ADSS_GetDryTemperature", 0) < first_index("Timer_SecCheckPassTime"));
    EXPECT(first_index("Timer_SecCheckPassTime") < nth_index("MWI_ADSS_GetDryTemperature", 1));

    EXPECT(count("Sys_SetErrorStatus") == 0);
}

/* VI #1: 초기 진입 재설정 - 이전 정적 단계와 무관하게 기준 온도 저장 경로 재진입 */
static void tc_initial_entry_resets_substep(void)
{
    INT16 temps[1];

    force_substep_two();

    mock_reset();
    gucFCT_ModeIndex = FCT_INIT_STEP;
    mstHP_ReceiveInfo.FanSpeed = DRY_TEST_FAN_RPM;
    temps[0] = 42;
    set_temp_returns(temps, 1);

    run_fut_iterations(2);

    /* [ORACLE: VI] FCT 초기 진입은 이전 sucSubStep 값이 2였더라도 0으로 초기화하여 팬 도달 시 기준 온도를 새로 저장해야 한다 */
    EXPECT(count("Timer_GetTime") == 1);
    EXPECT(count("MW_HP_GetReceiveInfo") == 1);
    EXPECT(count("MWI_ADSS_GetDryTemperature") == 1);
}

/* VI #3, #17: 팬 목표 미도달 지속 - 기준 온도 저장 및 REF 판정 조기 수행 금지 */
static void tc_fan_not_reached_no_ref_temp_saved(void)
{
    force_init_to_load_step();

    mock_reset();
    gucFCT_ModeIndex = FCT_LOAD5_STEP;
    mstHP_ReceiveInfo.FanSpeed = (UINT16)(DRY_TEST_FAN_RPM - 100);

    run_fut_iterations(3);

    EXPECT(count("MWI_HP_FctModeDryLoadControl") == 3);
    EXPECT(count("MW_HP_GetReceiveInfo") == 3);

    /* [ORACLE: VI] 팬 속도가 목표 미만 또는 경계값이면 REF 판정 기준 온도를 저장하지 않아야 한다 */
    EXPECT(count("MWI_ADSS_GetDryTemperature") == 0);

    /* [ORACLE: VI] 팬 속도 미도달 상태가 지속되어도 90초 판정 타이머와 REF 오류 설정이 조기 수행되지 않아야 한다 */
    EXPECT(count("Timer_SecCheckPassTime") == 0);
    EXPECT(count("Sys_SetErrorStatus") == 0);
}

/* VI #4: 90초 미경과 - REF 비교 및 오류 판정 미수행 */
static void tc_timer_not_elapsed_no_ref_check(void)
{
    UINT8 timerRets[1];

    force_substep_one_with_start_temp(50);

    mock_reset();
    gucFCT_ModeIndex = FCT_LOAD5_STEP;
    timerRets[0] = CLEAR;
    set_timer_returns(timerRets, 1);

    run_fut_iterations(1);

    EXPECT(count("Timer_SecCheckPassTime") == 1);
    EXPECT(nth("Timer_SecCheckPassTime", 0)->a2 == 90);

    /* [ORACLE: VI] 팬 목표 도달 후에도 90초가 경과하지 않으면 REF 비교 온도 읽기와 오류 설정이 수행되지 않아야 한다 */
    EXPECT(count("MWI_ADSS_GetDryTemperature") == 0);
    EXPECT(count("Sys_SetErrorStatus") == 0);
}

/* VI #4: 90초 경과 - REF 판정 1회 수행 및 이후 반복 금지 */
static void tc_timer_elapsed_ref_check_once(void)
{
    UINT8 timerRets[1];
    INT16 temps[1];

    force_substep_one_with_start_temp(50);

    mock_reset();
    gucFCT_ModeIndex = FCT_LOAD5_STEP;
    timerRets[0] = SET;
    temps[0] = 45;
    set_timer_returns(timerRets, 1);
    set_temp_returns(temps, 1);

    run_fut_iterations(1);

    /* [ORACLE: VI] 90초 경과 시점에는 REF 비교 온도 읽기를 통해 판정이 수행되어야 한다 */
    EXPECT(count("Timer_SecCheckPassTime") == 1);
    EXPECT(nth("Timer_SecCheckPassTime", 0)->a2 == 90);
    EXPECT(count("MWI_ADSS_GetDryTemperature") == 1);
    EXPECT(first_index("Timer_SecCheckPassTime") < first_index("MWI_ADSS_GetDryTemperature"));

    mock_reset();
    gucFCT_ModeIndex = FCT_LOAD5_STEP;
    run_fut_iterations(1);

    /* [ORACLE: VI] REF 판정 완료 후에는 동일 단계에서 판정이 반복 수행되지 않아야 한다 */
    EXPECT(count("Timer_SecCheckPassTime") == 0);
    EXPECT(count("MWI_ADSS_GetDryTemperature") == 0);
}

/* VI #5: 냉각 성능 부족 - HP_ERROR_REF 설정 */
static void tc_cooling_insufficient_sets_hp_error_ref(void)
{
    UINT8 timerRets[1];
    INT16 temps[1];
    MockCall *err;

    force_substep_one_with_start_temp(50);

    mock_reset();
    gucFCT_ModeIndex = FCT_LOAD5_STEP;
    timerRets[0] = SET;
    temps[0] = 49;
    set_timer_returns(timerRets, 1);
    set_temp_returns(temps, 1);

    run_fut_iterations(1);

    err = nth("Sys_SetErrorStatus", 0);

    /* [ORACLE: VI] 시작 EVA 대비 냉각 저하량이 2 미만이면 HP_ERROR_REF가 SET으로 설정되어야 한다 */
    EXPECT(count("Sys_SetErrorStatus") == 1);
    EXPECT(err != NULL && err->a1 == HP_ERROR_REF && err->a2 == SET);
    EXPECT(aucErrorStatus[HP_ERROR_REF] == SET);
}

/* VI #8: 중단 후 재시작 - 정적 단계와 타이머의 재초기화 기대 */
static void tc_restart_reinitializes_static_state(void)
{
    UINT8 timerRets[1];
    INT16 temps[1];

    force_substep_one_with_start_temp(50);

    mock_reset();
    gucFCT_ModeIndex = FCT_LOAD5_STEP;
    mstHP_ReceiveInfo.FanSpeed = (UINT16)(DRY_TEST_FAN_RPM - 200);
    timerRets[0] = SET;
    temps[0] = 50;
    set_timer_returns(timerRets, 1);
    set_temp_returns(temps, 1);

    run_fut_iterations(1);

    /* [ORACLE: VI] 시험 중단 후 재시작 시 sucSubStep과 타이머가 초기화되어 팬 재도달 전 REF 타이머 판정이 수행되지 않아야 한다 */
    EXPECT(count("Timer_SecCheckPassTime") == 0);
    EXPECT(count("MWI_ADSS_GetDryTemperature") == 0);
    EXPECT(count("Sys_SetErrorStatus") == 0);
}

/* ========== 7. main ========== */
int main(void)
{
    RUN_TC(tc_happy_full_sequence);
    RUN_TC(tc_initial_entry_resets_substep);
    RUN_TC(tc_fan_not_reached_no_ref_temp_saved);
    RUN_TC(tc_timer_not_elapsed_no_ref_check);
    RUN_TC(tc_timer_elapsed_ref_check_once);
    RUN_TC(tc_cooling_insufficient_sets_hp_error_ref);
    RUN_TC(tc_restart_reinitializes_static_state);

    printf("\nSUMMARY: %d cases, %d passed, %d failed (%d asserts failed)\n",
           g_tc_total, g_tc_passed, g_tc_failed, g_fail);
    return g_tc_failed == 0 ? 0 : 1;
}
`;

const TEST_LOG = `# AISE test execution log

- total: 6
- passed: 5
- failed: 1
- build-fail: 0

---

## VI #1 [PASSED] test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c
- runs: 3/3 passed
- duration: 0.005s
- testcases: 1 total, 1 passed, 0 failed

### Passed cases
- tc_initial_entry_resets_substep

## VI #3 [PASSED] test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c
- runs: 3/3 passed
- duration: 0.003s
- testcases: 1 total, 1 passed, 0 failed

### Passed cases
- tc_fan_not_reached_no_ref_temp_saved

## VI #4 [PASSED] test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c
- runs: 3/3 passed
- duration: 0.002s
- testcases: 3 total, 3 passed, 0 failed

### Passed cases
- tc_happy_full_sequence
- tc_timer_not_elapsed_no_ref_check
- tc_timer_elapsed_ref_check_once

## VI #5 [PASSED] test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c
- runs: 3/3 passed
- duration: 0.003s
- testcases: 1 total, 1 passed, 0 failed

### Passed cases
- tc_cooling_insufficient_sets_hp_error_ref

## VI #8 [FAILED] test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c
- runs: 0/3 passed
- duration: 0.003s
- testcases: 1 total, 0 passed, 1 failed

### Failed cases
- tc_restart_reinitializes_static_state
  - test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c:652  count("Timer_SecCheckPassTime") == 0
  - test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c:653  count("MWI_ADSS_GetDryTemperature") == 0
  - test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c:654  count("Sys_SetErrorStatus") == 0

## VI #17 [PASSED] test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c
- runs: 3/3 passed
- duration: 0.003s
- testcases: 1 total, 1 passed, 0 failed

### Passed cases
- tc_fan_not_reached_no_ref_temp_saved
`;

const MARKDOWN = `# 검증 리포트 — 38346d48f4be @ r119765

> 생성일시: 2026-05-27 05:43:57
> 범례: ✅ PASS · 🐞 DEFECT(잠재 결함·사람 확인) · ❌ RUN FAIL(Oracle 재검토) · 🔴 BUILD FAIL · 🔁 COVERED(기존 테스트) · ⏭ SKIP(NOMATCH/TIER/GATE)

## 요약

| 전체 | 성공 | 잠재 결함 | 실패 | 미검증 | 대상 아님 | Git commits |
|---:|---:|---:|---:|---:|---:|---:|
| 19 | 5 | 1 | 0 | 3 | 10 | 0 |

## 검증 항목

| VI | Tier | 검증 항목 | 분류 | 사유 | 테스트 / FUT |
|---:|:--:|------|:--:|------|------|
| #8 | T4 | 정적 변수 \`snStartEva\`, \`sucSubStep\`, 타이머가 시험 중단/재시작 시 의도대로 재초기화되는지 확인 | 🐞 잠재 결함 | FUT 잠재 결함 — 시험 중단 후 재시작 시 FCT_LOAD5_STEP로 재진입하면 정적 sucSubStep, snStartEva 및 타이머가 재초기화되지 않아 팬 재도달 전 REF 타이머 판정과 온도 비교/오류 설정 경로가 실행된다 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` |
| #1 | T4 | FCT 초기 진입 시 \`sucSubStep\`가 항상 0으로 초기화되는지 확인 | ✅ 성공 | 이전 substep=2 후 INIT 재진입 시 온도 저장 경로 재진입을 관찰해 초기화 검증 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` |
| #3 | T4 | 팬 속도 목표 도달 전에는 REF 판정 기준 온도가 저장되지 않는지 확인 | ✅ 성공 | 팬속도 경계 미도달 반복에서 온도 저장 호출 0회를 직접 검증 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` |
| #4 | T4 | 팬 속도 목표 도달 후 90초 경과 시점에만 REF 오류 판정이 수행되는지 확인 | ✅ 성공 | 90초 미경과/경과/반복 방지 모두 확인해 REF 판정 시점을 검증 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` |
| #5 | T4 | 냉각 성능 부족 시 \`HP_ERROR_REF\`가 정상 설정되는지 확인 | ✅ 성공 | 냉각 부족 조건에서 HP_ERROR_REF와 SET 인자를 직접 확인 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` |
| #17 | T4 | 팬 속도 미도달 상태가 지속될 때 REF 판정이 조기 수행되지 않는지 확인 | ✅ 성공 | 팬 미도달 지속 반복에서 타이머와 오류 판정 호출이 없음을 직접 검증 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` |
| #2 | T4 | FCT 종료 후 재진입 시 이전 시험의 sub-step 상태가 잔존하지 않는지 확인 | ⏭ 미검증 | 재진입 상태 전이를 목으로 구성해 static 잔존 여부 검증 | — |
| #6 | T4 | 정상 냉각 시 오류가 오검출되지 않는지 확인 | ⏭ 미검증 | 정상 냉각 입력을 목킹해 오류 미설정 동작 확인 가능 | — |
| #7 | T6 | 해당 없음. 제공된 변경 범위 내 외부 파일 형식/업로드 포맷 변경은 확인되지 않음 | ⏭ 수동/통합 테스트 | 변경 범위와 포맷 영향 없음은 사람의 범위 판단 필요 | — |
| #9 | T5 | 전원 재인가 또는 모드 전환 시 FCT 상태가 비정상적으로 이어지지 않는지 확인 | ⏭ 타겟/HIL 테스트 | 전원 재인가·모드 전환은 런타임 초기화 시퀀스 의존 | — |

## Best-of-N 채택 결과

| VI | 후보 테스트 파일 | 라벨 | 사유 |
|---:|------|:--:|------|
| #1 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` | BEST_BEHAVIORAL | 이전 substep=2 후 INIT 재진입 시 온도 저장 경로 재진입을 관찰해 초기화 검증 |
| #3 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` | BEST_BEHAVIORAL | 팬속도 경계 미도달 반복에서 온도 저장 호출 0회를 직접 검증 |
| #4 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` | BEST_BEHAVIORAL | 90초 미경과/경과/반복 방지 모두 확인해 REF 판정 시점을 검증 |
| #5 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` | BEST_BEHAVIORAL | 냉각 부족 조건에서 HP_ERROR_REF와 SET 인자를 직접 확인 |
| #8 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` | BEST_BEHAVIORAL | 재호출 후 팬 미도달 시 타이머·온도·오류 미수행으로 정적 상태 초기화 기대 검증 |
| #17 | \`test_vi_1_3_4_5_8_17_Run_DRY_FCT_ModeProcess.c\` | BEST_BEHAVIORAL | 팬 미도달 지속 반복에서 타이머와 오류 판정 호출이 없음을 직접 검증 |
`;

export const UNIT_TEST_AGENT_MOCK_FILES: Record<string, string> = {
  [TEST_FILE_NAME]: TEST_FILE_CONTENT,
};

export const UNIT_TEST_AGENT_MOCK_TEST_LOG = TEST_LOG;
export const UNIT_TEST_AGENT_MOCK_TEST_LOG_NAME = "test_report_r119765.log";
export const UNIT_TEST_AGENT_MOCK_MARKDOWN = MARKDOWN;
